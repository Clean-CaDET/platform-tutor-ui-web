import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeeklyFeedbackService } from './weekly-feedback.service';
import { WeeklyFeedback } from './weekly-feedback.model';
import { WeeklyProgressStatistics, WeeklyRatingStatistics } from '../weekly-progress/model/weekly-summary.model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'cc-weekly-feedback',
  templateUrl: './weekly-feedback.component.html',
  styleUrl: './weekly-feedback.component.scss'
})
export class WeeklyFeedbackComponent implements OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  @Input() selectedDate: Date;

  @Input() rating: WeeklyRatingStatistics;
  @Input() results: WeeklyProgressStatistics;
  
  feedback: WeeklyFeedback[];
  selectedFeedback: WeeklyFeedback;

  constructor(private feedbackService: WeeklyFeedbackService, private builder: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.courseId || changes?.learnerId) {
      this.getFeedback();
      return;
    }
    if(changes?.selectedDate && this.feedback?.length) {
      this.selectedFeedback = this.findFeedbackForSelectedDate();
      if(this.selectedFeedback) return;
      this.feedback = this.feedback.filter(f => f.id);
      this.createNewFeedback();
    }
  }
  
  getFeedback() {
    this.feedbackService.getByCourseAndLearner(this.courseId, this.learnerId).subscribe(feedback => {
      this.feedback = feedback;
      this.feedback.sort((a, b) => a.selectedDate.getTime() - b.selectedDate.getTime());
      this.temp();
      this.selectedFeedback = this.findFeedbackForSelectedDate();
      if(this.selectedFeedback) return;
      this.createNewFeedback();
    });
  }

  private createNewFeedback(): void {
    this.selectedFeedback = {
      selectedDate: this.selectedDate,
      averageSatisfaction: this.rating?.avgLearnerSatisfaction,
      achievedTaskPoints: this.results?.totalLearnerPoints,
      maxTaskPoints: this.results?.totalMaxPoints,
    };
    this.feedback.push(this.selectedFeedback);
  }

  private findFeedbackForSelectedDate(): WeeklyFeedback {
    return this.feedback.find(f => {
      const startDate = new Date(f.selectedDate);
      startDate.setDate(startDate.getDate() - 1);
      const endDate = new Date(f.selectedDate);
      endDate.setDate(f.selectedDate.getDate() + 1);
  
      return this.selectedDate >= startDate && this.selectedDate <= endDate;
    });
  }

  getColor(feedback: WeeklyFeedback): string {
    if(!feedback.semaphore) return '';
    if(feedback.semaphore === 1) return 'warn';
    if(feedback.semaphore === 2) return 'accent';
    if(feedback.semaphore === 3) return 'primary';
  }

  temp() {
    this.feedback = [
      {
        id: 1,
        courseId: 100,
        learnerId: 200,
        instructorId: 301,
        instructorName: "John Doe",
        selectedDate: new Date('2024-09-10'),
        semaphore: 1,
        semaphoreJustification: "Excellent performance",
        averageSatisfaction: 4.5,
        achievedTaskPoints: 85,
        maxTaskPoints: 100
      },
      {
        id: 2,
        courseId: 100,
        learnerId: 200,
        instructorId: 302,
        instructorName: "Jane Smith",
        selectedDate: new Date('2024-09-12'),
        semaphore: 2,
        semaphoreJustification: "Good, but room for improvement",
        averageSatisfaction: 4.0,
        achievedTaskPoints: 78,
        maxTaskPoints: 100
      },
      {
        id: 3,
        courseId: 100,
        learnerId: 200,
        instructorId: 303,
        instructorName: "Emily Johnson",
        selectedDate: new Date('2024-09-15'),
        semaphore: 3,
        semaphoreJustification: "Needs attention",
        averageSatisfaction: 3.5,
        achievedTaskPoints: 70,
        maxTaskPoints: 100
      },
      {
        id: 1,
        courseId: 100,
        learnerId: 200,
        instructorId: 301,
        instructorName: "John Doe",
        selectedDate: new Date('2024-09-10'),
        semaphore: 1,
        semaphoreJustification: "Excellent performance",
        averageSatisfaction: 4.5,
        achievedTaskPoints: 85,
        maxTaskPoints: 100
      },
      {
        id: 2,
        courseId: 100,
        learnerId: 200,
        instructorId: 302,
        instructorName: "Jane Smith",
        selectedDate: new Date('2024-09-12'),
        semaphore: 2,
        semaphoreJustification: "Good, but room for improvement",
        averageSatisfaction: 4.0,
        achievedTaskPoints: 78,
        maxTaskPoints: 100
      },
      {
        id: 3,
        courseId: 100,
        learnerId: 200,
        instructorId: 303,
        instructorName: "Emily Johnson",
        selectedDate: new Date('2024-09-15'),
        semaphore: 3,
        semaphoreJustification: "Needs attention",
        averageSatisfaction: 3.5,
        achievedTaskPoints: 70,
        maxTaskPoints: 100
      },
      {
        id: 1,
        courseId: 100,
        learnerId: 200,
        instructorId: 301,
        instructorName: "John Doe",
        selectedDate: new Date('2024-09-10'),
        semaphore: 1,
        semaphoreJustification: "Excellent performance",
        averageSatisfaction: 4.5,
        achievedTaskPoints: 85,
        maxTaskPoints: 100
      },
      {
        id: 2,
        courseId: 100,
        learnerId: 200,
        instructorId: 302,
        instructorName: "Jane Smith",
        selectedDate: new Date('2024-09-12'),
        semaphore: 2,
        semaphoreJustification: "Good, but room for improvement",
        averageSatisfaction: 4.0,
        achievedTaskPoints: 78,
        maxTaskPoints: 100
      },
      {
        id: 3,
        courseId: 100,
        learnerId: 200,
        instructorId: 303,
        instructorName: "Emily Johnson",
        selectedDate: new Date('2024-09-15'),
        semaphore: 3,
        semaphoreJustification: "Needs attention",
        averageSatisfaction: 3.5,
        achievedTaskPoints: 70,
        maxTaskPoints: 100
      },
      {
        id: 1,
        courseId: 100,
        learnerId: 200,
        instructorId: 301,
        instructorName: "John Doe",
        selectedDate: new Date('2024-09-10'),
        semaphore: 1,
        semaphoreJustification: "Excellent performance",
        averageSatisfaction: 4.5,
        achievedTaskPoints: 85,
        maxTaskPoints: 100
      },
      {
        id: 2,
        courseId: 100,
        learnerId: 200,
        instructorId: 302,
        instructorName: "Jane Smith",
        selectedDate: new Date('2024-09-12'),
        semaphore: 2,
        semaphoreJustification: "Good, but room for improvement",
        averageSatisfaction: 4.0,
        achievedTaskPoints: 78,
        maxTaskPoints: 100
      },
      {
        id: 3,
        courseId: 100,
        learnerId: 200,
        instructorId: 303,
        instructorName: "Emily Johnson",
        selectedDate: new Date('2024-09-15'),
        semaphore: 3,
        semaphoreJustification: "Needs attention",
        averageSatisfaction: 3.5,
        achievedTaskPoints: 70,
        maxTaskPoints: 100
      }
    ]
  }
}
