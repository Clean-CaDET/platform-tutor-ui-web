import { Component, ChangeDetectionStrategy, input, inject, signal, effect, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { MultipleResponseQuestion, MrqItem } from '../../../model/learning-object.model';
import { MrqEvaluation, MrqItemEvaluation } from '../../../model/evaluation.model';
import { SubmissionService } from '../../submission.service';
import { AssessmentFeedbackConnectorService } from '../../assessment-feedback-connector.service';
import { shuffleArray } from '../../../model/arrays';

@Component({
  selector: 'cc-mrq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, MatButtonModule, MatListModule, CcMarkdownComponent],
  templateUrl: './mrq.component.html',
  styleUrl: './mrq.component.scss',
})
export class MrqComponent implements OnInit {
  private readonly submissionService = inject(SubmissionService);
  private readonly connector = inject(AssessmentFeedbackConnectorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly item = input.required<MultipleResponseQuestion>();

  readonly items = signal<MrqItem[]>([]);
  readonly checked = signal<boolean[]>([]);
  readonly evaluation = signal<MrqEvaluation | null>(null);
  readonly isProcessing = signal(false);
  private reattemptCount = 0;

  constructor() {
    effect(() => {
      const currentItem = this.item();
      this.items.set(shuffleArray([...currentItem.items]));
      this.checked.set(new Array(this.items().length).fill(false));
      this.evaluation.set(null);
      this.isProcessing.set(false);
      this.reattemptCount = 0;
    });
  }

  ngOnInit(): void {
    this.connector.resultToAssessment$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(feedback => {
      this.isProcessing.set(false);
      if (feedback.type === 'Solution' || feedback.type === 'Correctness') {
        this.evaluation.set(feedback.evaluation as MrqEvaluation);
      }
    });
  }

  toggleItem(index: number): void {
    this.checked.update(arr => {
      const copy = [...arr];
      copy[index] = !copy[index];
      return copy;
    });
  }

  onSubmit(): void {
    const checkedAnswers = this.items()
      .filter((_, i) => this.checked()[i]);

    this.isProcessing.set(true);
    this.submissionService.submit(this.item().id, {
      $type: 'mrqSubmission',
      answers: checkedAnswers,
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

  getAnswerResult(text: string): MrqItemEvaluation | undefined {
    return this.evaluation()?.itemEvaluations?.find(e => e.text === text);
  }

  hasCheckedAnswers(): boolean {
    return this.checked().some(c => c);
  }
}
