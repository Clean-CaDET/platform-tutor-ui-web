import {
  Component, ChangeDetectionStrategy, inject, signal, effect,
  DestroyRef, ElementRef, viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { CanComponentDeactivate } from '../../../core/confirm-exit.guard';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';
import { NotificationService } from '../../../core/notification/notification.service';
import { ConceptElaborationService } from './concept-elaboration.service';
import { ElaborationConversationService } from './elaboration-conversation.service';
import { ConceptElaborationTask } from './model/concept-elaboration-task.model';
import { ConversationAttempt } from './model/conversation-attempt.model';
import { ElaborationTranscriptComponent } from './transcript/elaboration-transcript.component';
import { ElaborationAttemptHistoryComponent } from './attempt-history/elaboration-attempt-history.component';
import { ElaborationComposerComponent } from './composer/elaboration-composer.component';

type Mode =
  | { kind: 'loading' }
  | { kind: 'idleNoHistory'; task: ConceptElaborationTask }
  | { kind: 'idleWithInProgress'; task: ConceptElaborationTask; attempt: ConversationAttempt }
  | { kind: 'idleTerminal'; task: ConceptElaborationTask }
  | { kind: 'active'; task: ConceptElaborationTask }
  | { kind: 'terminal'; task: ConceptElaborationTask; attempt: ConversationAttempt }
  | { kind: 'error'; message: string };

@Component({
  selector: 'cc-concept-elaboration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule,
    CcMarkdownComponent, ElaborationTranscriptComponent, ElaborationAttemptHistoryComponent, ElaborationComposerComponent,
  ],
  templateUrl: './concept-elaboration.component.html',
  styleUrl: './concept-elaboration.component.scss',
  providers: [ElaborationConversationService],
})
export class ConceptElaborationComponent implements CanComponentDeactivate {
  private readonly service = inject(ConceptElaborationService);
  private readonly conversation = inject(ElaborationConversationService);
  private readonly notify = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly destroyRef = inject(DestroyRef);

  readonly mode = signal<Mode>({ kind: 'loading' });

  readonly transcript = this.conversation.transcript;
  readonly isThinking = this.conversation.isThinking;
  readonly isStreaming = this.conversation.isStreaming;
  readonly pinnedQuestion = this.conversation.pinnedQuestion;

  protected courseId = 0;
  protected unitId = 0;

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

    this.conversation.completed$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(attempt => this.handleCompleted(attempt));

    this.conversation.reconciled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(attemptId => this.handleReconciled(attemptId));

    this.conversation.errored$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ code }) => this.handleError(code));

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
    this.conversation.reset();
    this.userScrolled.set(false);
    this.mode.set({ kind: 'active', task: m.task });
  }

  resumeInProgress(): void {
    const m = this.mode();
    if (m.kind !== 'idleWithInProgress') return;
    this.conversation.seed(m.attempt);
    this.userScrolled.set(false);
    this.mode.set({ kind: 'active', task: m.task });
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
    this.userScrolled.set(false);
    this.conversation.submit(m.task.id, content);
  }

  onComposerAbandon(): void {
    const m = this.mode();
    if (m.kind !== 'active') return;
    if (!confirm('Prekinuti ovu konverzaciju? Napredak pokušaja biće napušten.')) return;
    const attemptId = this.conversation.currentAttemptId();
    if (attemptId === null) {
      this.loadTask(m.task.id);
      return;
    }
    this.mode.set({ kind: 'loading' });
    this.conversation.reset();
    this.service.abandon(attemptId).subscribe({
      next: () => this.loadTask(m.task.id),
      error: () => this.loadTask(m.task.id),
    });
  }

  onScrollAreaScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    this.userScrolled.set(!nearBottom);
  }

  private handleCompleted(attempt: ConversationAttempt): void {
    const m = this.mode();
    if (m.kind !== 'active') return;
    this.mode.set({ kind: 'terminal', task: m.task, attempt });
  }

  private handleReconciled(attemptId: number): void {
    const m = this.mode();
    if (m.kind !== 'active') return;
    this.service.get(m.task.id).subscribe({
      next: task => {
        const active = task.attempts.find(a => a.id === attemptId);
        if (active && active.status === 'InProgress') {
          this.conversation.seed(active);
          this.mode.set({ kind: 'active', task });
        } else {
          this.setModeFromTask(task);
        }
      },
      error: () => this.loadTask(m.task.id),
    });
  }

  private handleError(code: number): void {
    const m = this.mode();
    switch (code) {
      case 402:
        this.notify.error('Nedostatak tokena. Kontaktiraj administratora.');
        this.composer()?.restore(this.lastAttemptedContent);
        break;
      case 429:
        this.notify.error('Dnevni broj pokušaja iscrpljen.');
        this.composer()?.restore(this.lastAttemptedContent);
        break;
      case 404:
        this.notify.error('Sadržaj nije pronađen.');
        if (m.kind === 'active') this.loadTask(m.task.id);
        break;
      default:
        this.notify.error('Greška. Pokušaj ponovo.');
        this.composer()?.restore(this.lastAttemptedContent);
        break;
    }
  }

  private loadTask(taskId: number): void {
    if (!taskId) return;
    this.conversation.reset();
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
