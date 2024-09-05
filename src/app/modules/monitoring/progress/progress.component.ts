import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Learner } from '../model/learner.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ProgressService } from './progress.service';
import { initializeUnit, UnitHeader } from './model/unit-header.model';
import { calculateUnitRatingStatistics, calculateWeeklySatisfactionStatistics, UnitProgressRating, WeeklyRatingStatistics } from './model/rating.model';

@Component({
  selector: 'cc-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  groupMemberIds: Set<number>;

  selectedDate: Date;

  units: UnitHeader[] = [];
  weeklyRatingStatistics: WeeklyRatingStatistics;
  
  feedbackForm: FormGroup;

  constructor(private progressService: ProgressService, private builder: FormBuilder) { }

  ngOnInit() {
    this.selectedDate = new Date("7/1/2024"); // TODO
    this.getUnits();
  }

  ngOnChanges() {
    this.groupMemberIds = new Set(this.learners.map(l => l.id));
      // TODO: Get statistics if selectedLearner changes
      /*
      1. GetWeeklyProgress (semaphore, instructorId, internal comment, external comment, totalTaskGrade, averageSatisfactionWithProgress)
      2. If units
        3. GetKcMasteriesAndTaskProgressByLearner
      */
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>) {
    if(!event?.value) return;
    this.selectedDate = event.value;
    this.getUnits();
  }

  private getUnits() {
    // TODO: Disable datepicker and show progress bar
    this.progressService.getWeeklyUnitsWithTasksAndKcs(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units => {
      units.sort((a, b) => a.order - b.order);
      if(this.retrievedUnitsAlreadyLoaded(units)) return;
      
      this.units = units;
      if(!this.units?.length) return;
      this.units.forEach(u => initializeUnit(u));

      this.progressService.getLearnerFeedback(
        this.units.map(u => u.id), this.selectedDate)
        .subscribe(allRatings => {
          this.processRatingsAndLinkToUnits(allRatings);
          this.weeklyRatingStatistics = calculateWeeklySatisfactionStatistics(allRatings, this.selectedLearnerId, this.groupMemberIds);
          this.units.forEach(u => u.rating = calculateUnitRatingStatistics(u.rating.ratings, this.selectedLearnerId));
        });
      this.progressService.GetKcAndTaskProgressAndWarnings(
        this.units.map(u => u.id), this.selectedLearnerId, [...this.groupMemberIds])
        .subscribe(unitSummaries => this.LinkSummariesToUnits(unitSummaries));
    });
    // TODO: Enable datepicker and hide progress bar
  }

  private retrievedUnitsAlreadyLoaded(newUnits: UnitHeader[]): boolean {
    if(!this.units?.length) return false;
    if(newUnits.length !== this.units.length) return false;
    return this.units.every((unit, index) => unit.id === newUnits[index].id);
  }
  
  private processRatingsAndLinkToUnits(allRatings: UnitProgressRating[]) {
    allRatings.forEach(rating => {
      // Process rating
      rating.feedback = JSON.parse(rating.feedback.toString());

      if (this.groupMemberIds.has(rating.learnerId)) {
        // Link to unit
        const relatedUnit = this.units.find(u => u.id === rating.knowledgeUnitId);
        if (!relatedUnit) return;
        relatedUnit.rating.ratings.push(rating);

        // Link to task
        if(isNaN(rating.feedback.taskChallenge)) return;
        rating.completedTaskIds.forEach(taskId => {
          const relatedTask = relatedUnit.tasks.find(t => t.id === taskId);
          if(!relatedTask) return;
          relatedTask.rating = rating;
        });
      }
    });
  }

  private LinkSummariesToUnits(unitSummaries: import("c:/Users/lubur/Desktop/Sandbox/platform-tutor-ui-web/src/app/modules/monitoring/progress/model/unit-statistics.model").UnitSummaryStatistics[]) {
    unitSummaries.forEach(summary => {
      const relatedUnit = this.units.find(u => u.id === summary.unitId);
      if (!relatedUnit) return;
      relatedUnit.kcStatistics = summary.kcStatistics;
      relatedUnit.taskStatistics = summary.taskStatistics;
      summary.taskPoints.forEach(points => {
        let relatedTask = relatedUnit.tasks.find(t => t.id === points.taskId);
        relatedTask.learnerPoints = points.wonPoints;
      });
    });
  }
}