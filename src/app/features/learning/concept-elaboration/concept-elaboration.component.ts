import {
  Component, ChangeDetectionStrategy, inject, signal, computed, effect,
  DestroyRef, ElementRef, viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';
import { NotificationService } from '../../../core/notification/notification.service';
import { ConceptElaborationService } from './concept-elaboration.service';
import { ConceptElaborationStreamService } from './concept-elaboration-stream.service';
import { ConceptElaborationTask } from './model/concept-elaboration-task.model';
import { ConversationAttempt } from './model/conversation-attempt.model';
import { ConversationTurn } from './model/conversation-turn.model';
import { StreamChunk } from './model/stream-chunk.model';
import { AttemptStatus } from './model/attempt-status.model';
import { ElaborationTranscriptComponent } from './transcript/elaboration-transcript.component';
import { ElaborationAttemptHistoryComponent } from './attempt-history/elaboration-attempt-history.component';
import { ElaborationComposerComponent } from './composer/elaboration-composer.component';

type Mode =
  | { kind: 'loading' }
  | { kind: 'idleNoHistory'; task: ConceptElaborationTask }
  | { kind: 'idleWithInProgress'; task: ConceptElaborationTask; attempt: ConversationAttempt }
  | { kind: 'idleTerminal'; task: ConceptElaborationTask }
  | { kind: 'active'; task: ConceptElaborationTask; attemptId: number | null }
  | { kind: 'terminal'; task: ConceptElaborationTask; attempt: ConversationAttempt }
  | { kind: 'error'; message: string };

@Component({
  selector: 'cc-concept-elaboration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule,
    CcMarkdownComponent,
    ElaborationTranscriptComponent, ElaborationAttemptHistoryComponent, ElaborationComposerComponent,
  ],
  templateUrl: './concept-elaboration.component.html',
  styleUrl: './concept-elaboration.component.scss',
})
export class ConceptElaborationComponent implements CanComponentDeactivate {
  private readonly service = inject(ConceptElaborationService);
  private readonly streamService = inject(ConceptElaborationStreamService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = signal<Mode>({ kind: 'loading' });
  readonly transcript = signal<ConversationTurn[]>([]);
  readonly isThinking = signal(false);
  readonly isStreaming = signal(false);
  readonly submitDisabled = computed(() => this.isThinking() || this.isStreaming());
  readonly pinnedQuestion = computed(() => {
    const turns = this.transcript();
    const streaming = this.isStreaming();
    let startIdx = turns.length - 1;
    if (streaming && startIdx >= 0 && turns[startIdx].role === 'System') startIdx--;
    for (let i = startIdx; i >= 0; i--) {
      if (turns[i].role === 'System') return turns[i].content;
    }
    return '';
  });

  protected courseId = 0;
  protected unitId = 0;

  private nextSyntheticId = -1;
  private streamSub: Subscription | null = null;
  private lastAttemptedContent = '';
  private userScrolled = signal(false);

  readonly composer = viewChild<ElaborationComposerComponent>('composer');
  readonly scrollArea = viewChild<ElementRef<HTMLDivElement>>('scrollArea');

  constructor() {
    const params = getRouteParams(this.route);
    this.courseId = +params['courseId'];
    this.unitId = +params['unitId'];
    const taskId = +params['taskId'];
    let initialLoaded = false;
    if (taskId) {
      this.loadTask(taskId);
      initialLoaded = true;
    }

    onNavigationEnd((_url, p) => {
      if (initialLoaded) { initialLoaded = false; return; }
      this.courseId = +p['courseId'];
      this.unitId = +p['unitId'];
      this.loadTask(+p['taskId']);
    });

    effect(() => {
      this.transcript();
      this.isStreaming();
      if (this.userScrolled()) return;
      const ref = this.scrollArea();
      if (!ref) return;
      requestAnimationFrame(() => {
        const el = ref.nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    });
  }

  canDeactivate(): boolean {
    if (this.mode().kind !== 'active') return true;
    return confirm('Konverzacija je u toku. Ako napustiš stranicu, pokušaj ostaje neobavljen i možeš ga nastaviti kasnije.');
  }

  startConversation(): void {
    const m = this.mode();
    if (m.kind !== 'idleNoHistory' && m.kind !== 'idleTerminal' && m.kind !== 'terminal') return;
    this.transcript.set([]);
    this.isThinking.set(false);
    this.isStreaming.set(false);
    this.userScrolled.set(false);
    this.mode.set({ kind: 'active', task: m.task, attemptId: null });
  }

  resumeInProgress(): void {
    const m = this.mode();
    if (m.kind !== 'idleWithInProgress') return;
    const turns = [...m.attempt.turns].sort((a, b) => a.order - b.order);
    this.transcript.set(turns);
    this.isThinking.set(false);
    this.isStreaming.set(false);
    this.userScrolled.set(false);
    this.mode.set({ kind: 'active', task: m.task, attemptId: m.attempt.id });
  }

  declineResume(): void {
    const m = this.mode();
    if (m.kind !== 'idleWithInProgress') return;
    if (!confirm('Napusti prethodni pokušaj i započni novi?')) return;
    this.service.abandon(m.attempt.id).subscribe({
      next: () => this.loadTask(m.task.id),
      error: () => this.loadTask(m.task.id),
    });
  }

  onComposerSubmit(content: string): void {
    const m = this.mode();
    if (m.kind !== 'active') return;
    this.lastAttemptedContent = content;
    this.appendLearnerTurn(content);
    this.isThinking.set(true);
    this.isStreaming.set(false);
    this.userScrolled.set(false);

    const source = m.attemptId === null
      ? this.streamService.startConversation(m.task.id, content)
      : this.streamService.continueConversation(m.attemptId, content);

    this.streamSub?.unsubscribe();
    this.streamSub = source.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: chunk => this.handleChunk(chunk),
      error: () => this.handleFatalStreamError(),
    });
  }

  onComposerAbandon(): void {
    const m = this.mode();
    if (m.kind !== 'active') return;
    if (!confirm('Prekinuti ovu konverzaciju? Napredak pokušaja biće napušten.')) return;
    this.streamSub?.unsubscribe();
    this.streamSub = null;
    this.isThinking.set(false);
    this.isStreaming.set(false);
    if (m.attemptId === null) {
      this.loadTask(m.task.id);
      return;
    }
    this.service.abandon(m.attemptId).subscribe({
      next: () => this.loadTask(m.task.id),
      error: () => this.loadTask(m.task.id),
    });
  }

  onScrollAreaScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    this.userScrolled.set(!nearBottom);
  }

  private handleChunk(chunk: StreamChunk): void {
    switch (chunk.kind) {
      case 'text':
        if (this.isThinking()) {
          this.isThinking.set(false);
          this.isStreaming.set(true);
          this.beginSystemTurn();
        } else if (!this.isStreaming()) {
          this.isStreaming.set(true);
          this.beginSystemTurn();
        }
        this.appendToLastSystemTurn(chunk.value);
        break;
      case 'metadata':
        this.handleMetadata(chunk);
        break;
      case 'error':
        this.handleStreamErrorChunk(chunk);
        break;
    }
  }

  private handleMetadata(chunk: {
    kind: 'metadata'; attemptId: number; status: AttemptStatus; summary: string | null;
  }): void {
    const m = this.mode();
    if (m.kind !== 'active') return;

    this.isThinking.set(false);
    this.isStreaming.set(false);

    if (chunk.status === 'InProgress') {
      this.mode.set({ kind: 'active', task: m.task, attemptId: chunk.attemptId });
    } else {
      const attempt: ConversationAttempt = {
        id: chunk.attemptId,
        conceptElaborationTaskId: m.task.id,
        status: chunk.status,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        summary: chunk.summary,
        turns: this.transcript(),
      };
      this.mode.set({ kind: 'terminal', task: m.task, attempt });
    }
  }

  private handleStreamErrorChunk(chunk: {
    kind: 'error'; code: number; message: string; attemptId?: number;
  }): void {
    const m = this.mode();
    switch (chunk.code) {
      case 409:
        if (m.kind === 'active' && chunk.attemptId) {
          const resumedAttemptId = chunk.attemptId;
          this.service.get(m.task.id).subscribe({
            next: task => {
              const active = task.attempts.find(a => a.id === resumedAttemptId);
              if (active && active.status === 'InProgress') {
                const turns = [...active.turns].sort((a, b) => a.order - b.order);
                this.transcript.set(turns);
                this.isThinking.set(false);
                this.isStreaming.set(false);
                this.mode.set({ kind: 'active', task, attemptId: active.id });
              } else {
                this.setModeFromTask(task);
              }
            },
            error: () => this.loadTask(m.task.id),
          });
        } else {
          this.rollbackOptimistic();
        }
        break;
      case 402:
        this.notify.error('Nedostatak tokena. Kontaktiraj administratora.');
        this.rollbackOptimistic();
        this.restoreComposer();
        break;
      case 429:
        this.notify.error('Dnevni broj pokušaja iscrpljen.');
        this.rollbackOptimistic();
        this.restoreComposer();
        break;
      case 403:
        this.notify.error('Nemate pristup.');
        this.router.navigate(['/courses', this.courseId, 'units', this.unitId]);
        break;
      case 404:
        this.notify.error('Sadržaj nije pronađen.');
        if (m.kind === 'active') this.loadTask(m.task.id);
        break;
      default:
        this.notify.error('Greška. Pokušaj ponovo.');
        this.rollbackOptimistic();
        this.restoreComposer();
        break;
    }
  }

  private handleFatalStreamError(): void {
    this.notify.error('Greška. Pokušaj ponovo.');
    this.rollbackOptimistic();
    this.restoreComposer();
  }

  private rollbackOptimistic(): void {
    this.isThinking.set(false);
    this.isStreaming.set(false);
    this.transcript.update(turns => {
      let t = turns;
      if (t.length && t[t.length - 1].role === 'System' && t[t.length - 1].id < 0) {
        t = t.slice(0, -1);
      }
      if (t.length && t[t.length - 1].role === 'Learner' && t[t.length - 1].id < 0) {
        t = t.slice(0, -1);
      }
      return t;
    });
  }

  private restoreComposer(): void {
    this.composer()?.restore(this.lastAttemptedContent);
  }

  private appendLearnerTurn(content: string): void {
    this.transcript.update(turns => [
      ...turns,
      {
        id: this.nextSyntheticId--,
        role: 'Learner' as const,
        content,
        isSubstantive: true,
        order: turns.length,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  private beginSystemTurn(): void {
    this.transcript.update(turns => [
      ...turns,
      {
        id: this.nextSyntheticId--,
        role: 'System' as const,
        content: '',
        isSubstantive: true,
        order: turns.length,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  private appendToLastSystemTurn(delta: string): void {
    this.transcript.update(turns => {
      if (turns.length === 0) return turns;
      const idx = turns.length - 1;
      const last = turns[idx];
      if (last.role !== 'System') return turns;
      return [...turns.slice(0, idx), { ...last, content: last.content + delta }];
    });
  }

  private loadTask(taskId: number): void {
    if (!taskId) return;
    this.mode.set({ kind: 'loading' });
    this.service.get(taskId).subscribe({
      next: task => this.setModeFromTask(task),
      error: () => this.mode.set({
        kind: 'error',
        message: 'Elaboracija nije ispravno dobavljena.',
      }),
    });
  }

  private setModeFromTask(task: ConceptElaborationTask): void {
    this.title.setTitle(`${task.title} - Tutor`);
    const inProgress = task.attempts.find(a => a.status === 'InProgress');
    if (inProgress) {
      this.mode.set({ kind: 'idleWithInProgress', task, attempt: inProgress });
    } else if (task.attempts.length === 0) {
      this.mode.set({ kind: 'idleNoHistory', task });
    } else {
      this.mode.set({ kind: 'idleTerminal', task });
    }
  }
}
