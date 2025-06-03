import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WeeklyFeedbackService } from './weekly-feedback.service';
import { createOpinions, WeeklyFeedback } from './weekly-feedback.model';
import { WeeklyProgressStatistics } from '../weekly-progress/model/weekly-summary.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { QuestionGroup, QuestionOptions } from './weekly-feedback-questions.service';

@Component({
  selector: 'cc-weekly-feedback',
  templateUrl: './weekly-feedback.component.html',
  styleUrl: './weekly-feedback.component.scss'
})
export class WeeklyFeedbackComponent implements OnInit, OnChanges {
  @Input() courseId: number;
  @Input() learnerId: number;
  @Input() selectedDate: Date;
  @Input() questionGroups: QuestionGroup[];

  @Input() avgLearnerSatisfaction: number;
  @Input() results: WeeklyProgressStatistics;
  @Input() loaded: boolean;
  
  feedback: WeeklyFeedback[];
  selectedFeedback: WeeklyFeedback;
  form: FormGroup;
  progressBarActive: boolean;

  constructor(private builder: FormBuilder, private dialog: MatDialog, private feedbackService: WeeklyFeedbackService) {}

  ngOnInit(): void {
    const formControls: Record<string, FormControl> = {};
    for (let group of this.questionGroups) {
      for (let question of group.questions) {
        const defaultOption = question.options.find(o => o.isDefault);
        formControls[question.code] = new FormControl(defaultOption?.value ?? question.options[0].value);
      }
    }
    formControls['semaphore'] = new FormControl('2');
    formControls['semaphoreJustification'] = new FormControl('');
    this.form = this.builder.group(formControls);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.courseId || changes?.learnerId) {
      this.feedbackService.getByCourseAndLearner(this.courseId, this.learnerId).subscribe(feedback => {
        this.feedback = feedback;
        this.selectOrInitializeFeedback();
      });
      return;
    }
    if(changes?.selectedDate && this.feedback?.length) {
      this.feedback = this.feedback.filter(f => f.id); // Removes uncommited feedback
      this.selectOrInitializeFeedback();
    }
    if(changes?.results) {
      if(this.selectedFeedback?.id) return;
      const opinions = createOpinions(changes.results.currentValue);
      opinions?.forEach(o => this.form.get(o.code)?.setValue(o.value));
    }
  }

  private selectOrInitializeFeedback() {
    const selectedFeedback = this.findFeedbackForSelectedDate();
    if(selectedFeedback) {
      this.selectFeedback(selectedFeedback);
      return;
    }
    this.createNewFeedback();
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
    this.feedback = this.feedback.filter(i => i.id);
    const selectedDate = new Date(this.selectedDate);
    selectedDate.setDate(selectedDate.getDate() + 1);
    this.selectFeedback({
      weekEnd: selectedDate,
      semaphore: 2,
      semaphoreJustification: '',
      learnerId: this.learnerId
    });
    for (let group of this.questionGroups) {
      for (let question of group.questions) {
        const defaultOption = question.options.find(o => o.isDefault);
        if(!defaultOption) continue;
        this.form.get(question.code).setValue(defaultOption.value);
      }
    }
    this.feedback.push(this.selectedFeedback);
    this.feedback.sort((a, b) => a.weekEnd.getTime() - b.weekEnd.getTime());
  }

  selectFeedback(feedback: WeeklyFeedback): void {
    this.selectedFeedback = feedback;
    this.form.patchValue(this.selectedFeedback);
    feedback.opinions?.forEach(o => this.form.get(o.code)?.setValue(o.value));
  }

  getColor(formControlName: string, options?: QuestionOptions[]): string {
    const controlValue = this.form.get(formControlName)?.value;
    if(!options) {
      return this.getStandardColors(controlValue);
    }
    const selectedOption = options.find(o => o.value === controlValue);
    return selectedOption?.color;
  }

  getStandardColors(value: number) {
    if(value === 1) return 'warn';
    if(value === 2) return 'accent';
    if(value === 3) return 'primary';
    return 'accent';
  }

  onSubmit(): void {
    this.progressBarActive = true;
    this.selectedFeedback.semaphore = this.form.value.semaphore;
    this.selectedFeedback.semaphoreJustification = this.form.value.semaphoreJustification;
    this.populateOpinions();
    this.embedStatistics();
    if(this.selectedFeedback.id) {
      this.feedbackService.update(this.courseId, this.selectedFeedback)
        .subscribe(feedback => {
          this.feedbackService.notify(feedback);
          this.progressBarActive = false;
        });
    } else {
      this.feedbackService.create(this.courseId, this.selectedFeedback)
        .subscribe(newFeedback => {
          this.selectedFeedback.id = newFeedback.id;
          this.feedbackService.notify(newFeedback);
          this.progressBarActive = false;
        });
    }
  }

  private populateOpinions() {
    if (this.selectedFeedback.id && !this.selectedFeedback.opinions) return; // Support legacy feedback
      
    this.selectedFeedback.opinions = [];
    const questions = this.questionGroups.flatMap(g => g.questions);
    questions.forEach(q => {
      const value = this.form.get(q.code)?.value;
      const label = q.options.find(o => o.value === value).label;
      this.selectedFeedback.opinions.push({ code: q.code, label, value });
    });
  }

  private embedStatistics() {
    const feedbackForSelectedDate = this.findFeedbackForSelectedDate();
    if(this.selectedFeedback.id && feedbackForSelectedDate.id !== this.selectedFeedback.id) return;
    
    // Embeds stats if new feedback or displayed statistics relate to updated feedback
    this.selectedFeedback.averageSatisfaction = this.avgLearnerSatisfaction;
    this.selectedFeedback.achievedTaskPoints = this.results?.achievedPoints;
    this.selectedFeedback.maxTaskPoints = this.results?.totalMaxPoints;
  }

  public onDelete(id: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.progressBarActive = true;
      this.feedbackService.delete(this.courseId, id).subscribe(() => {
        this.feedback = this.feedback.filter(i => i.id !== id);
        this.createNewFeedback();
        const opinions = createOpinions(this.results);
        opinions?.forEach(o => this.form.get(o.code)?.setValue(o.value));
        this.feedbackService.notify(null);
        this.progressBarActive = false;
      });
    });
  }
}
