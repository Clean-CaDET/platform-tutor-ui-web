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
import { ConversationTurn } from '../model/conversation-turn.model';

interface Round {
  learner: ConversationTurn;
  system: ConversationTurn | null;
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

  readonly contentControl = new FormControl('', { nonNullable: true });
  private readonly contentValue = toSignal(this.contentControl.valueChanges, { initialValue: '' });
  private readonly lastSubmitted = signal('');
  readonly isComplete = signal(false);

  private readonly userScrolled = signal(false);
  readonly scrollArea = viewChild<ElementRef<HTMLDivElement>>('scrollArea');

  readonly isThinking = this.conversation.isThinking;
  readonly isStreaming = this.conversation.isStreaming;

  readonly rounds = computed<Round[]>(() => {
    const turns = this.conversation.transcript();
    const streaming = this.conversation.isStreaming();
    const result: Round[] = [];
    let i = 0;
    while (i < turns.length) {
      if (turns[i].role === 'Learner') {
        const learner = turns[i];
        const next = turns[i + 1];
        const system = next?.role === 'System' ? next : null;
        result.push({
          learner,
          system,
          isSystemStreaming: streaming && system !== null && i + 1 === turns.length - 1,
        });
        i += system ? 2 : 1;
      } else {
        i++;
      }
    }
    return result;
  });

  readonly canSubmit = computed(() => {
    const val = this.contentValue().trim();
    return (
      val.length > 0 &&
      val !== this.lastSubmitted().trim() &&
      !this.isThinking() &&
      !this.isStreaming() &&
      !this.isComplete()
    );
  });

  readonly isDirty = computed(() =>
    !this.isComplete() &&
    (this.conversation.transcript().length > 0 || this.conversation.currentAttemptId() !== null)
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.conversation.reset());

    effect(() => {
      if (this.isThinking() || this.isStreaming() || this.isComplete()) {
        this.contentControl.disable({ emitEvent: false });
      } else {
        this.contentControl.enable({ emitEvent: false });
      }
    });

    effect(() => {
      const attempt = this.inProgress();
      if (attempt) {
        this.conversation.seed(attempt);
        const sorted = [...attempt.turns].sort((a, b) => a.order - b.order);
        const lastLearner = [...sorted].filter(t => t.role === 'Learner').pop();
        if (lastLearner) {
          this.contentControl.setValue(lastLearner.content);
          this.lastSubmitted.set(lastLearner.content);
        }
      }
    }, { allowSignalWrites: true });

    this.conversation.completed$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isComplete.set(true));

    this.conversation.reconciled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(attemptId => this.handleReconciled(attemptId));

    this.conversation.errored$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ code }) => this.handleError(code));

    effect(() => {
      this.conversation.transcript();
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

  onAbandon(): void {
    if (this.isComplete()) {
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
        if (active && active.status === 'InProgress') {
          this.conversation.seed(active);
          const lastLearner = [...active.turns].filter(t => t.role === 'Learner').pop();
          if (lastLearner) this.lastSubmitted.set(lastLearner.content);
        } else {
          this.isComplete.set(true);
        }
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
