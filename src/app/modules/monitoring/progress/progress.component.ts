import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Learner } from '../model/learner.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ProgressService } from './progress.service';
import { UnitHeader, updateTimelineItems } from './model/unit-header.model';
import { getChallengeRatingLabel, UnitProgressRating } from './model/unit-rating.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';
import { WeeklyRatingStatistics, WeeklyProgressStatistics, calculateWeeklySatisfactionStatistics, calculateWeeklyProgressStatistics } from './model/weekly-summary.model';

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
  weeklyRatings: WeeklyRatingStatistics;
  weeklyResults: WeeklyProgressStatistics;
  
  constructor(private progressService: ProgressService) {
    this.selectedDate = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    
    if(this.changeOccured(changes.learners)) {
      this.groupMemberIds = new Set(this.learners.map(l => l.id));
      this.getUnits(true);
    } else if(this.changeOccured(changes.selectedLearnerId)) {
      // TODO: 1. GetWeeklyProgress (semaphore, instructorId, internal comment, external comment, totalTaskGrade, averageSatisfactionWithProgress)
      
      if(!this.units?.length) return;
      this.linkAndSummarizeRatings();
      this.getKcAndTaskProgressAndWarnings();
    }
  }

  private changeOccured(changedField: { currentValue: any, previousValue: any }) {
    return changedField && changedField.currentValue && changedField.currentValue !== changedField.previousValue;
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
        if(invokedByGroupChange && this.units.length) { // TODO: Refactor
          this.linkAndSummarizeRatings();
          this.getKcAndTaskProgressAndWarnings();
        }
        return;
      }
      
      this.units = units;
      if(!this.units?.length) return;

      this.progressService.getAllRatings(this.units.map(u => u.id), this.selectedDate)
        .subscribe(allRatings => {
          this.allRatings = allRatings.map(rating => {
            rating.feedback = JSON.parse(rating.feedback.toString());
            return rating;
          });
          this.linkAndSummarizeRatings();
          this.getKcAndTaskProgressAndWarnings();
        });
    });
    // TODO: Enable datepicker and hide progress bar (consider all HTTP requests)
  }

  private retrievedUnitsAlreadyLoaded(newUnits: UnitHeader[]): boolean {
    if(this.units.length === 0 && newUnits.length === 0) return true;
    if(newUnits.length !== this.units.length) return false;
    return this.units.every((unit, index) => unit.id === newUnits[index].id);
  }

  private linkAndSummarizeRatings() {
    this.units.forEach(u => u.ratings = []);
    this.allRatings.forEach(rating => {
      if (rating.learnerId !== this.selectedLearnerId) return;
      const relatedUnit = this.units.find(u => u.id === rating.knowledgeUnitId);
      if(!relatedUnit) return null;
      
      if(rating.completedKcIds?.length) {
        rating.completedKcNames = [];
        rating.completedKcIds.forEach(kcId => rating.completedKcNames.push(relatedUnit.knowledgeComponents.find(kc => kc.id === kcId).name));
      }
      if(rating.completedTaskIds?.length) {
        rating.completedTaskNames = [];
        rating.feedback.taskChallenge = getChallengeRatingLabel(rating.feedback.taskChallenge);
        rating.completedTaskIds.forEach(tId => rating.completedKcNames.push(relatedUnit.tasks.find(t => t.id === tId).name))
      };
      
      relatedUnit.ratings.push(rating);
    });

    this.weeklyRatings = calculateWeeklySatisfactionStatistics(this.allRatings, this.selectedLearnerId, this.groupMemberIds);
  }

  private getKcAndTaskProgressAndWarnings() {
    if(!this.selectedLearnerId) return;

    this.progressService.GetKcAndTaskProgressAndWarnings(
      this.units.map(u => u.id), this.selectedLearnerId, [...this.groupMemberIds])
      .subscribe(unitSummaries => {
        this.linkStatisticsToUnits(unitSummaries);
        this.weeklyResults = calculateWeeklyProgressStatistics(this.units);
      });
  }

  private linkStatisticsToUnits(unitSummaries: UnitProgressStatistics[]) {
    unitSummaries.forEach(summary => {
      const relatedUnit = this.units.find(u => u.id === summary.unitId);
      if (!relatedUnit) return;
      relatedUnit.kcStatistics = summary.kcStatistics;
      relatedUnit.taskStatistics = summary.taskStatistics;
      relatedUnit.knowledgeComponents?.forEach(kc => kc.statistics = summary.kcStatistics.satisfiedKcStatistics.find(s => s.kcId === kc.id));
      relatedUnit.tasks?.forEach(t => t.statistics = summary.taskStatistics.gradedTaskStatistics.find(s => s.taskId === t.id));
      updateTimelineItems(relatedUnit);
    });
  }
}