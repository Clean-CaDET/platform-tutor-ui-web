import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Learner } from '../model/learner.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ProgressService } from './progress.service';
import { initializeUnit, UnitHeader } from './model/unit-header.model';
import { calculateUnitRatingStatistics, calculateWeeklySatisfactionStatistics, UnitProgressRating, WeeklyRatingStatistics } from './model/rating.model';
import { calculateWeeklyGradeStatistics, UnitProgressStatistics, WeeklyGradeStatistics } from './model/progress-statistics.model';

@Component({
  selector: 'cc-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnChanges {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  groupMemberIds: Set<number>;
  allRatings: UnitProgressRating[];

  selectedDate: Date;

  units: UnitHeader[] = [];
  weeklyRatingStatistics: WeeklyRatingStatistics;
  weeklyGradeStatistics: WeeklyGradeStatistics;
  
  feedbackForm: FormGroup;

  constructor(private progressService: ProgressService, private builder: FormBuilder) {
    this.selectedDate = new Date("7/1/2024"); // TODO
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    
    if(this.changeOccured(changes.learners)) {
      this.groupMemberIds = new Set(this.learners.map(l => l.id));
      this.getUnits(true);
    } else if(this.changeOccured(changes.selectedLearnerId)) {
      // 1. GetWeeklyProgress (semaphore, instructorId, internal comment, external comment, totalTaskGrade, averageSatisfactionWithProgress)
      // 2. If Units
      //  !GetKcAndTaskProgress
      //  2a. Weekly summary
      //  Change avg student grade, count, comments
      //  Change grades
      
      //  2b. Per unit
      //  Change KC summary student
      //  Change student task rating
      //  Change grade
    }
  }

  private changeOccured(changedField: { currentValue: any, previousValue: any }) {
    return changedField && changedField.currentValue !== changedField.previousValue;
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>) {
    if(!event?.value) return;
    this.selectedDate = event.value;
    this.getUnits();
  }

  private getUnits(invokedByGroupChange: boolean = false) {
    // TODO: Disable datepicker and show progress bar
    this.progressService.getWeeklyUnitsWithTasksAndKcs(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units => {
      units.sort((a, b) => a.order - b.order);
      if(this.retrievedUnitsAlreadyLoaded(units)) {
        if(invokedByGroupChange) this.calculateRatingStatistics(this.allRatings); // TODO: Refactor
        return;
      }
      
      this.units = units;
      if(!this.units?.length) return;
      this.units.forEach(u => initializeUnit(u));

      this.progressService.getAllRatings(this.units.map(u => u.id), this.selectedDate)
        .subscribe(allRatings => this.calculateRatingStatistics(allRatings));
      //this.getKcAndTaskProgressAndWarnings();
    });
    // TODO: Enable datepicker and hide progress bar
  }

  private retrievedUnitsAlreadyLoaded(newUnits: UnitHeader[]): boolean {
    if(!this.units?.length) return false;
    if(newUnits.length !== this.units.length) return false;
    return this.units.every((unit, index) => unit.id === newUnits[index].id);
  }

  private calculateRatingStatistics(allRatings: UnitProgressRating[]) {
    this.allRatings = allRatings;
    this.processRatingsAndLinkToUnits();
    this.weeklyRatingStatistics = calculateWeeklySatisfactionStatistics(allRatings, this.selectedLearnerId, this.groupMemberIds);
    this.units.forEach(u => u.rating = calculateUnitRatingStatistics(u.rating.ratings, this.selectedLearnerId));
  }

  private processRatingsAndLinkToUnits() {
    this.allRatings.forEach(rating => {
      // Process rating on retrieval from back-end
      if(typeof rating.feedback === 'string') {
        rating.feedback = JSON.parse(rating.feedback);
      }

      // Link ratings made by group members to unit
      if (this.groupMemberIds.has(rating.learnerId)) {
        const relatedUnit = this.units.find(u => u.id === rating.knowledgeUnitId);
        if (!relatedUnit) return;
        relatedUnit.rating.ratings.push(rating);

        this.linkLearnerTaskRating(rating, relatedUnit);
      }
    });
  }

  private linkLearnerTaskRating(rating: UnitProgressRating, relatedUnit: UnitHeader) {
    if(rating.learnerId !== this.selectedLearnerId) return;
    if(isNaN(rating.feedback.taskChallenge)) return;
    rating.completedTaskIds.forEach(taskId => {
      const relatedTask = relatedUnit.tasks.find(t => t.id === taskId);
      if(!relatedTask) return;
      relatedTask.rating = rating;
    });
  }
  
  private getKcAndTaskProgressAndWarnings() {
    this.progressService.GetKcAndTaskProgressAndWarnings(
      this.units.map(u => u.id), this.selectedLearnerId, [...this.groupMemberIds])
      .subscribe(unitSummaries => {
        this.linkSummariesToUnits(unitSummaries);
        this.weeklyGradeStatistics = calculateWeeklyGradeStatistics(this.units);
      });
  }

  private linkSummariesToUnits(unitSummaries: UnitProgressStatistics[]) {
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