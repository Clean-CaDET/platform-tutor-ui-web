import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SubmissionStatisticsService } from './submission-statistics.service';
import { SubmissionStatistics } from './submission-statistics.model';

@Component({
  selector: 'cc-submission-statistics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogContent, MatDividerModule],
  template: `
    <mat-dialog-content>
      <small>
        @for (sub of statistics(); track $index; let last = $last) {
          @if (sub.submission.$type === 'saqSubmission' || sub.submission.$type === 'mcqSubmission') {
            <div><b>Count</b>: {{ sub.count }}; <b>Answer</b>: {{ sub.submission.answer }}</div>
          } @else if (sub.submission.$type === 'mrqSubmission') {
            <div>
              <b>Count</b>: {{ sub.count }}; <b>Answers</b>:
              <ul>
                @for (a of sub.submission.answers; track $index) {
                  <li>{{ a.text }}</li>
                }
              </ul>
            </div>
          }
          @if (!last) {
            <mat-divider />
          }
        }
      </small>
    </mat-dialog-content>
  `,
})
export class SubmissionStatisticsComponent {
  private readonly service = inject(SubmissionStatisticsService);
  private readonly data = inject<{ kcId: number; aiId: number }>(MAT_DIALOG_DATA);

  readonly statistics = signal<SubmissionStatistics[]>([]);

  constructor() {
    this.service.getAll(this.data.kcId, this.data.aiId).subscribe(stats => {
      this.statistics.set(stats);
    });
  }
}
