import {
  Component, ChangeDetectionStrategy, inject, signal, computed, effect,
  DestroyRef, ElementRef, viewChild, input, output,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { ConceptElaborationService } from '../concept-elaboration.service';
import { ElaborationConversationService } from '../elaboration-conversation.service';
import { NotificationService } from '../../../../core/notification/notification.service';
import { ConceptElaborationTask } from '../model/concept-elaboration-task.model';
import { ConversationAttempt } from '../model/conversation-attempt.model';

interface Round {
  elaborationContent: string;
  feedbackContent: string | null;
  isSystemStreaming: boolean;
}

@Component({
  selector: 'cc-elaboration-session',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
    CcMarkdownComponent,
  ],
  templateUrl: './elaboration-session.component.html',
  styleUrl: './elaboration-session.component.scss',
  providers: [ElaborationConversationService],
})
export class ElaborationSessionComponent {
  private readonly conversation = inject(ElaborationConversationService);
  private readonly service = inject(ConceptElaborationService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly task = input.required<ConceptElaborationTask>();
  readonly inProgress = input<ConversationAttempt | null>(null);
  readonly courseId = input.required<number>();

  readonly sessionEnded = output<void>();
  readonly newSessionRequested = output<void>();

  readonly contentControl = new FormControl('', { nonNullable: true });
  private readonly contentValue = toSignal(this.contentControl.valueChanges, { initialValue: '' });
  private readonly lastSubmitted = signal('');
  readonly status = signal('InProgress');
  readonly isDone = computed(() => this.status() === 'Completed' || this.status() === 'Expired');

  private readonly userScrolled = signal(false);
  readonly scrollArea = viewChild<ElementRef<HTMLDivElement>>('scrollArea');
  private readonly elaborationTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('elaborationTextarea');

  readonly isThinking = this.conversation.isThinking;
  readonly isStreaming = this.conversation.isStreaming;

  readonly rounds = computed<Round[]>(() => {
    const conversationRounds = this.conversation.rounds();
    const streaming = this.conversation.isStreaming();
    const last = conversationRounds.length - 1;
    return conversationRounds.map((r, i) => ({
      elaborationContent: r.elaborationContent,
      feedbackContent: r.feedbackContent,
      isSystemStreaming: streaming && r.feedbackContent !== null && i === last,
    }));
  });

  readonly canSubmit = computed(() => {
    const val = this.contentValue().trim();
    return (
      val.length > 0 &&
      val !== this.lastSubmitted().trim() &&
      !this.isThinking() &&
      !this.isStreaming() &&
      this.status() === 'InProgress'
    );
  });

  readonly isDirty = computed(() =>
    this.status() === 'InProgress' &&
    (this.conversation.rounds().length > 0 || this.conversation.currentAttemptId() !== null)
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.conversation.reset());

    effect(() => {
      if (this.isThinking() || this.isStreaming() || this.status() !== 'InProgress') {
        this.contentControl.disable({ emitEvent: false });
      } else {
        this.contentControl.enable({ emitEvent: false });
        requestAnimationFrame(() => this.elaborationTextarea()?.nativeElement.focus());
      }
    });

    effect(() => {
      const attempt = this.inProgress();
      if (attempt) {
        this.conversation.seed(attempt);
        const lastRound = [...attempt.rounds].sort((a, b) => a.order - b.order).at(-1);
        if (lastRound) {
          this.contentControl.setValue(lastRound.elaborationContent);
          this.lastSubmitted.set(lastRound.elaborationContent);
        }
      }
    }, { allowSignalWrites: true });

    this.conversation.completed$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((attempt) => this.status.set(attempt.status));

    this.conversation.reconciled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(attemptId => this.handleReconciled(attemptId));

    this.conversation.errored$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ code }) => this.handleError(code));

    effect(() => {
      this.conversation.rounds();
      this.conversation.isStreaming();
      if (this.userScrolled()) return;
      const ref = this.scrollArea();
      if (!ref) return;
      requestAnimationFrame(() => {
        const el = ref.nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    });
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;
    const value = this.contentControl.value.trim();
    this.lastSubmitted.set(value);
    this.userScrolled.set(false);
    this.conversation.submit(this.task().id, value);
  }

  onStartNew(): void {
    if (this.status() !== 'InProgress') {
      this.resetForNewSession();
      this.newSessionRequested.emit();
      return;
    }
    if (!confirm('Započinjanjem nove elaboraciju prekidaš trenutnu. Da li ti je to želja?')) return;
    const attemptId = this.conversation.currentAttemptId();
    if (attemptId === null) {
      this.resetForNewSession();
      this.newSessionRequested.emit();
      return;
    }
    this.service.abandon(attemptId).subscribe({
      next: () => {
        this.resetForNewSession();
        this.newSessionRequested.emit();
      },
      error: () => this.notify.error('Greška pri napuštanju konverzacije.'),
    });
  }

  private resetForNewSession(): void {
    this.conversation.reset();
    this.status.set('InProgress');
    this.contentControl.setValue('');
    this.lastSubmitted.set('');
    this.userScrolled.set(false);
  }

  onAbandon(): void {
    if (this.rounds().length === 0 || this.isDone()) {
      this.sessionEnded.emit();
      return;
    }
    if (!confirm('Prekinuti ovu konverzaciju? Napredak pokušaja biće napušten.')) return;
    const attemptId = this.conversation.currentAttemptId();
    if (attemptId === null) {
      this.sessionEnded.emit();
      return;
    }
    this.service.abandon(attemptId).subscribe({
      next: () => this.sessionEnded.emit(),
      error: () => this.notify.error('Greška pri napuštanju konverzacije.'),
    });
  }

  onScrollAreaScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    this.userScrolled.set(!nearBottom);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  private handleReconciled(attemptId: number): void {
    this.service.get(this.task().id).subscribe({
      next: task => {
        const active = task.attempts.find(a => a.id === attemptId);
        if(!active) return;
        this.status.set(active.status);
        this.conversation.seed(active);
        const lastRound = [...active.rounds].sort((a, b) => a.order - b.order).at(-1);
        if (lastRound) this.lastSubmitted.set(lastRound.elaborationContent);
      },
    });
  }

  private handleError(code: number): void {
    switch (code) {
      case 402:
        this.notify.error('Nedostatak tokena. Kontaktiraj administratora.');
        break;
      case 429:
        this.notify.error('Dnevni broj pokušaja iscrpljen.');
        break;
      case 404:
        this.notify.error('Sadržaj nije pronađen.');
        break;
      default:
        this.notify.error('Greška. Pokušaj ponovo.');
        break;
    }
  }
}
