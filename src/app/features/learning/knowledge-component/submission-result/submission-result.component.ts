import { Component, ChangeDetectionStrategy, input, output, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KnowledgeComponentService } from '../knowledge-component.service';
import { AssessmentFeedbackConnectorService } from '../assessment-feedback-connector.service';
import { KcStatistics } from '../../model/kc-statistics.model';
import { Feedback } from '../../model/feedback.model';
import { TypingAnimatorDirective } from './typing-animator.directive';
import { createFeedbackMessage, welcomeMessage } from './feedback-message-creator';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-submission-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TypingAnimatorDirective, MatDividerModule],
  templateUrl: './submission-result.component.html',
  styleUrl: './submission-result.component.scss',
})
export class SubmissionResultComponent implements OnInit {
  private readonly kcService = inject(KnowledgeComponentService);
  private readonly connector = inject(AssessmentFeedbackConnectorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly kcId = input.required<number>();
  readonly courseId = input.required<number>();
  readonly unitId = input.required<number>();
  readonly changePage = output<'AE' | 'IE'>();

  readonly statistics = signal<KcStatistics | null>(null);
  readonly feedbackMessages = signal<string[]>([]);
  readonly feedbackProcessed = signal(false);
  readonly expanded = signal(false);

  private messageTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadStatistics();

    this.connector.assessmentToResult$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(feedback => {
      this.loadStatistics(feedback);
    });
  }

  onChangePage(page: 'AE' | 'IE'): void {
    if (this.messageTimeout) clearTimeout(this.messageTimeout);
    this.feedbackProcessed.set(false);
    this.feedbackMessages.set([]);
    this.changePage.emit(page);
  }

  private loadStatistics(feedback?: Feedback): void {
    if (feedback?.type === 'Error') {
      this.messageTimeout = setTimeout(() => {
        this.feedbackMessages.set([createFeedbackMessage(feedback)]);
        this.feedbackProcessed.set(true);
        this.connector.sendToAssessment(feedback);
      }, 400);
      return;
    }

    this.kcService.getStatistics(this.kcId()).subscribe(stats => {
      const wasSatisfied = this.statistics()?.isSatisfied ?? false;
      const isFirstSatisfaction = !wasSatisfied && stats.isSatisfied;
      this.statistics.set(stats);

      if (feedback) {
        this.processFeedback(feedback, isFirstSatisfaction);
      } else {
        this.feedbackMessages.set([welcomeMessage]);
      }
    });
  }

  private processFeedback(feedback: Feedback, isFirstSatisfaction: boolean): void {
    const message = createFeedbackMessage(feedback);
    const messages = isFirstSatisfaction
      ? [message, 'Čestitamo! Komponenta znanja savladana!']
      : [message];

    if (isFirstSatisfaction) {
      this.expanded.set(true);
    }

    this.feedbackProcessed.set(true);
    this.feedbackMessages.set(messages);
    this.messageTimeout = setTimeout(() => {
      this.connector.sendToAssessment(feedback);
    }, 1200);
  }
}
