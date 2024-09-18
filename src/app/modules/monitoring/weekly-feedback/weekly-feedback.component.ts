import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeeklyFeedbackService } from './weekly-feedback.service';
import { WeeklyFeedback } from '../weekly-progress/model/weekly-feedback.model';

@Component({
  selector: 'cc-weekly-feedback',
  templateUrl: './weekly-feedback.component.html',
  styleUrl: './weekly-feedback.component.scss'
})
export class WeeklyFeedbackComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  @Input() date: Date;
  feedback: WeeklyFeedback[];

  constructor(private feedbackService: WeeklyFeedbackService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(!(changes?.courseId || changes?.learnerId)) return;
    this.feedbackService.getByCourseAndLearner(this.courseId, this.learnerId)
      .subscribe(feedback => this.feedback = feedback);
  }
}
