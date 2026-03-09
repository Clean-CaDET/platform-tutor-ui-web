import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { AssessmentItem } from '../../model/learning-object.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'cc-assessment-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatTooltipModule, MatButtonModule, MatIconModule, CcMarkdownComponent],
  templateUrl: './assessment-item-list.component.html',
  styleUrl: './assessment-item-list.component.scss',
})
export class AssessmentItemListComponent {
  readonly items = input.required<AssessmentItem[]>();
  readonly visibleAnswers = signal<Record<number, boolean>>({});

  toggleAnswer(id: number): void {
    this.visibleAnswers.update(v => ({ ...v, [id]: !v[id] }));
  }

  isVisible(id: number): boolean {
    return !!this.visibleAnswers()[id];
  }
}
