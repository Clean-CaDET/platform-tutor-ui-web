import { Component, ChangeDetectionStrategy, input, inject, signal, effect, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { ShortAnswerQuestion } from '../../../model/learning-object.model';
import { SaqEvaluation } from '../../../model/evaluation.model';
import { SubmissionService } from '../../submission.service';
import { AssessmentFeedbackConnectorService } from '../../assessment-feedback-connector.service';

@Component({
  selector: 'cc-saq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CcMarkdownComponent],
  templateUrl: './saq.component.html',
  styleUrl: './saq.component.scss',
})
export class SaqComponent implements OnInit {
  private readonly submissionService = inject(SubmissionService);
  private readonly connector = inject(AssessmentFeedbackConnectorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly item = input.required<ShortAnswerQuestion>();

  readonly answer = signal('');
  readonly evaluation = signal<SaqEvaluation | null>(null);
  readonly isProcessing = signal(false);
  private reattemptCount = 0;

  constructor() {
    effect(() => {
      this.item();
      this.answer.set('');
      this.evaluation.set(null);
      this.isProcessing.set(false);
      this.reattemptCount = 0;
    });
  }

  ngOnInit(): void {
    this.connector.resultToAssessment$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(feedback => {
      this.isProcessing.set(false);
      if (feedback.type === 'Solution' || feedback.type === 'Correctness') {
        this.evaluation.set(feedback.evaluation as SaqEvaluation);
      }
    });
  }

  onSubmit(): void {
    this.isProcessing.set(true);
    this.submissionService.submit(this.item().id, {
      $type: 'saqSubmission',
      answer: this.answer(),
      reattemptCount: this.reattemptCount,
    }).subscribe({
      next: feedback => {
        this.reattemptCount++;
        this.connector.sendToResult(feedback);
      },
      error: () => {
        this.connector.sendToResult({ type: 'Error' });
      },
    });
  }
}
