import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WeeklyFeedbackService } from './weekly-feedback.service';
import { WeeklyFeedback } from './weekly-feedback.model';
import { WeeklyProgressStatistics, WeeklyRatingStatistics } from '../weekly-progress/model/weekly-summary.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';

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
  form: FormGroup;
  progressBarActive: boolean;

  constructor(private feedbackService: WeeklyFeedbackService, private builder: FormBuilder, private dialog: MatDialog) {
    this.form = this.builder.group({
      semaphore: new FormControl('2'),
      semaphoreJustification: new FormControl('')
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.courseId || changes?.learnerId) {
      this.getFeedback();
      return;
    }
    if(changes?.selectedDate && this.feedback?.length) {
      this.feedback = this.feedback.filter(f => f.id);
      const selectedFeedback = this.findFeedbackForSelectedDate();
      if(selectedFeedback) {
        this.selectFeedback(selectedFeedback);
        return;
      }
      this.createNewFeedback();
    }
  }
  
  getFeedback() {
    this.feedbackService.getByCourseAndLearner(this.courseId, this.learnerId).subscribe(feedback => {
      this.feedback = feedback;
      this.feedback.sort((a, b) => a.weekEnd.getTime() - b.weekEnd.getTime());
      const selectedFeedback = this.findFeedbackForSelectedDate();
      if(selectedFeedback) {
        this.selectFeedback(selectedFeedback);
        return;
      }
      this.createNewFeedback();
    });
  }

  private findFeedbackForSelectedDate(): WeeklyFeedback {
    return this.feedback.find(f => {
      const startDate = new Date(f.weekEnd);
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date(f.weekEnd);
      endDate.setDate(endDate.getDate() + 2);
  
      return this.selectedDate >= startDate && this.selectedDate <= endDate;
    });
  }

  private createNewFeedback(): void {
    this.feedback = [...this.feedback.filter(i => i.id)];
    const selectedDate = new Date(this.selectedDate);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.selectFeedback({
      weekEnd: selectedDate,
      semaphore: 2,
      semaphoreJustification: '',
      learnerId: this.learnerId,
      averageSatisfaction: this.rating?.avgLearnerSatisfaction,
      achievedTaskPoints: this.results?.totalLearnerPoints,
      maxTaskPoints: this.results?.totalMaxPoints
    });
    this.feedback.push(this.selectedFeedback);
    this.feedback.sort((a, b) => a.weekEnd.getTime() - b.weekEnd.getTime());
  }

  selectFeedback(feedback: WeeklyFeedback): void {
    this.selectedFeedback = feedback;
    this.form.patchValue(this.selectedFeedback);
  }

  getColor(semaphore: number): string {
    if(!semaphore) return '';
    if(semaphore === 1) return 'warn';
    if(semaphore === 2) return 'accent';
    if(semaphore === 3) return 'primary';
  }

  onSubmit(): void {
    this.progressBarActive = true;
    this.selectedFeedback.semaphore = this.form.value.semaphore;
    this.selectedFeedback.semaphoreJustification = this.form.value.semaphoreJustification;
    if(this.selectedFeedback.id) {
      this.updateFeedback();
    } else {
      this.feedbackService.create(this.courseId, this.selectedFeedback)
        .subscribe(newFeedback => {
          this.selectedFeedback.id = newFeedback.id;
          this.feedbackService.notify();
          this.progressBarActive = false;
        });
    }
  }

  private updateFeedback() {
    const feedbackForSelectedDate = this.findFeedbackForSelectedDate();
    if (feedbackForSelectedDate.id === this.selectedFeedback.id) { // Updates feedback stats only if displayed statistics relate to the feedback being updated
      this.selectedFeedback.averageSatisfaction = this.rating?.avgLearnerSatisfaction;
      this.selectedFeedback.achievedTaskPoints = this.results?.totalLearnerPoints;
      this.selectedFeedback.maxTaskPoints = this.results?.totalMaxPoints;
    }
    this.feedbackService.update(this.courseId, this.selectedFeedback)
      .subscribe(_ => {
        this.feedbackService.notify();
        this.progressBarActive = false;
      });
  }

  public onDelete(id: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.progressBarActive = true;
      this.feedbackService.delete(this.courseId, id).subscribe(() => {
        this.feedback = [...this.feedback.filter(i => i.id !== id)];
        this.createNewFeedback();
        this.feedbackService.notify();
        this.progressBarActive = false;
      });
    });
  }
}
