import { Component, ChangeDetectionStrategy, input, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { MultipleChoiceQuestion } from '../../../model/learning-object.model';
import { McqEvaluation } from '../../../model/evaluation.model';
import { SubmissionService } from '../../submission.service';
import { AssessmentFeedbackConnectorService } from '../../assessment-feedback-connector.service';
import { shuffleArray } from '../../../model/arrays';

@Component({
  selector: 'cc-mcq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatRadioModule, MatButtonModule, MatProgressSpinnerModule, CcMarkdownComponent],
  templateUrl: './mcq.component.html',
  styleUrl: './mcq.component.scss',
})
export class McqComponent implements OnInit {
  private readonly submissionService = inject(SubmissionService);
  private readonly connector = inject(AssessmentFeedbackConnectorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly item = input.required<MultipleChoiceQuestion>();

  readonly answers = signal<string[]>([]);
  readonly checked = signal('');
  readonly evaluation = signal<McqEvaluation | null>(null);
  readonly isProcessing = signal(false);
  private reattemptCount = 0;

  ngOnInit(): void {
    this.answers.set(shuffleArray([...this.item().possibleAnswers]));

    this.connector.resultToAssessment$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(feedback => {
      if (feedback.type === 'Solution' || feedback.type === 'Correctness') {
        this.evaluation.set(feedback.evaluation as McqEvaluation);
      }
    });
  }

  onSubmit(): void {
    this.isProcessing.set(true);
    this.submissionService.submit(this.item().id, {
      $type: 'mcqSubmission',
      answer: this.checked(),
      reattemptCount: this.reattemptCount,
    }).subscribe({
      next: feedback => {
        this.reattemptCount++;
        this.isProcessing.set(false);
        this.connector.sendToResult(feedback);
      },
      error: () => {
        this.isProcessing.set(false);
        this.connector.sendToResult({ type: 'Error' });
      },
    });
  }

  getItemClass(answer: string): string {
    const eval$ = this.evaluation();
    if (!eval$ || this.checked() !== answer) return '';
    return eval$.correctAnswer === answer ? 'color-correct' : 'color-wrong';
  }
}
