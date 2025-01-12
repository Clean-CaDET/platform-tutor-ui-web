import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Learner } from '../model/learner.model';
import { WeeklyActivityService } from './weekly-activity.service';
import { UnitHeader, updateTimelineItems } from './model/unit-header.model';
import { getChallengeRatingLabel, UnitProgressRating } from './model/unit-rating.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';
import { WeeklyRatingStatistics, WeeklyProgressStatistics, calculateWeeklySatisfactionStatistics, calculateWeeklyProgressStatistics } from './model/weekly-summary.model';

@Component({
  selector: 'cc-weekly-progress',
  templateUrl: './weekly-progress.component.html',
  styleUrls: ['./weekly-progress.component.scss']
})
export class WeeklyProgressComponent implements OnChanges {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  groupMemberIds: Set<number>;
  allRatings: UnitProgressRating[];
  readyForFeedback = false;
  @Input() selectedDate: Date;

  units: UnitHeader[] = [];
  weeklyRatings: WeeklyRatingStatistics;
  weeklyResults: WeeklyProgressStatistics;
  
  constructor(private weeklyActivityService: WeeklyActivityService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    
    if(this.changeOccured(changes.learners)) {
      this.groupMemberIds = new Set(this.learners.map(l => l.id));
      this.getUnits(true);
    } else if(this.changeOccured(changes.selectedLearnerId)) {
      if(!this.units?.length) return;
      this.linkAndSummarizeRatings();
      this.getKcAndTaskProgressAndWarnings();
    } else if(this.changeOccured(changes.selectedDate)) {
      this.getUnits();
    }
  }

  private changeOccured(changedField: { currentValue: any, previousValue: any }) {
    return changedField && changedField.currentValue && changedField.currentValue !== changedField.previousValue;
  }

  private getUnits(invokedByGroupChange: boolean = false) {
    this.weeklyActivityService.getWeeklyUnitsWithTasksAndKcs(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units => {
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

      this.weeklyActivityService.getAllRatings(this.units.map(u => u.id), this.selectedDate)
        .subscribe(allRatings => {
          this.allRatings = allRatings.map(rating => {
            rating.feedback = JSON.parse(rating.feedback.toString());
            return rating;
          });
          this.linkAndSummarizeRatings();
          this.getKcAndTaskProgressAndWarnings();
        });
    });
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
        rating.completedTaskIds.forEach(tId => rating.completedTaskNames.push(relatedUnit.tasks.find(t => t.id === tId).name))
      };
      
      relatedUnit.ratings.push(rating);
    });

    this.weeklyRatings = calculateWeeklySatisfactionStatistics(this.allRatings, this.selectedLearnerId, this.groupMemberIds);
  }

  private getKcAndTaskProgressAndWarnings() {
    if(!this.selectedLearnerId) return;
    this.readyForFeedback = false;
    this.weeklyActivityService.GetKcAndTaskProgressAndWarnings(
      this.units.map(u => u.id), this.selectedLearnerId, [...this.groupMemberIds])
      .subscribe(unitSummaries => {
        this.linkStatisticsToUnits(unitSummaries);
        this.weeklyResults = calculateWeeklyProgressStatistics(this.units);
        this.readyForFeedback = true;
      });
  }

  private linkStatisticsToUnits(unitSummaries: UnitProgressStatistics[]) {
    unitSummaries.forEach(summary => {
      const relatedUnit = this.units.find(u => u.id === summary.unitId);
      if (!relatedUnit) return;
      relatedUnit.kcStatistics = summary.kcStatistics;
      relatedUnit.taskStatistics = summary.taskStatistics;
      relatedUnit.knowledgeComponents?.forEach(kc => kc.statistics = summary.kcStatistics.satisfiedKcStatistics.find(s => s.kcId === kc.id));
      relatedUnit.tasks?.forEach(t => t.statistics = summary.taskStatistics.taskStatistics.find(s => s.taskId === t.id));
      updateTimelineItems(relatedUnit);
    });
  }

  public changeLearner(direction: number) {
    const currentLearner = this.learners.find(learner => learner.id == this.selectedLearnerId);
    const currentIndex = this.learners.indexOf(currentLearner);
    const newIndex = (currentIndex + direction + this.learners.length) % this.learners.length;
    this.selectedLearnerId = this.learners[newIndex].id;
    this.learnerChanged.emit(this.selectedLearnerId);
  }
}