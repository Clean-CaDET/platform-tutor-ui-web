import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Learner } from '../model/learner.model';
import { WeeklyActivityService } from './weekly-activity.service';
import { TimelineItem, UnitHeader, updateTimelineItems } from './model/unit-header.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';
import { WeeklyProgressStatistics, calculateWeeklyProgressStatistics } from './model/weekly-summary.model';
import { QuestionGroup, WeeklyFeedbackQuestionsService } from '../weekly-feedback/weekly-feedback-questions.service';

@Component({
  selector: 'cc-weekly-progress',
  templateUrl: './weekly-progress.component.html',
  styleUrls: ['./weekly-progress.component.scss']
})
export class WeeklyProgressComponent implements OnInit, OnChanges {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<Learner>();
  groupMemberIds: Set<number>;
  readyForFeedback = false;
  @Input() selectedDate: Date;

  units: UnitHeader[] = [];
  weeklyResults: WeeklyProgressStatistics;
  filterReflections: boolean = false;
  questionGroups: QuestionGroup[];
  
  constructor(private weeklyActivityService: WeeklyActivityService, private questionService: WeeklyFeedbackQuestionsService) {}

  ngOnInit(): void {
    this.questionService.getAll().subscribe(groups => this.questionGroups = groups);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    
    if(this.changeOccured(changes.learners)) {
      this.groupMemberIds = new Set(this.learners.map(l => l.id));
      this.getUnits(true);
    } else if(this.changeOccured(changes.selectedLearnerId)) {
      if(!this.units?.length) return;
      this.updateUnitItemStatistics();
    } else if(this.changeOccured(changes.selectedDate)) {
      this.getUnits();
    }
  }

  private changeOccured(changedField: { currentValue: any, previousValue: any }) {
    return changedField && changedField.currentValue && changedField.currentValue !== changedField.previousValue;
  }

  private getUnits(invokedByGroupChange: boolean = false) {
    this.weeklyActivityService.getWeeklyUnitsWithItems(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units => {
      units.sort((a, b) => a.order - b.order);
      if(this.retrievedUnitsAlreadyLoaded(units)) {
        if(invokedByGroupChange && this.units.length) { // TODO: Refactor
          this.updateUnitItemStatistics();
        }
        return;
      }
      this.units = units;
      if(!this.units?.length) return;

      this.updateUnitItemStatistics();
    });
  }

  filterItems(timelineItems: TimelineItem[]) {
    if(!this.filterReflections || !this.weeklyResults.avgSatisfaction) return timelineItems;
    return timelineItems.filter(i => i.type === "reflection");
  }

  private retrievedUnitsAlreadyLoaded(newUnits: UnitHeader[]): boolean {
    if(this.units.length === 0 && newUnits.length === 0) return true;
    if(newUnits.length !== this.units.length) return false;
    return this.units.every((unit, index) => unit.id === newUnits[index].id);
  }

  private updateUnitItemStatistics() {
    if(!this.selectedLearnerId) return;
    this.readyForFeedback = false;
    this.weeklyActivityService.GetTaskAndKcStatistics(
      this.units.map(u => u.id), this.selectedLearnerId, [...this.groupMemberIds])
      .subscribe(unitSummaries => {
        this.linkAndSummarizeStatistics(unitSummaries);
        this.readyForFeedback = true;
      });
  }

  private linkAndSummarizeStatistics(unitSummaries: UnitProgressStatistics[]) {
    unitSummaries.forEach(summary => {
      const relatedUnit = this.units.find(u => u.id === summary.unitId);
      if (!relatedUnit) return;
      relatedUnit.kcStatistics = summary.kcStatistics;
      relatedUnit.taskStatistics = summary.taskStatistics;
      relatedUnit.knowledgeComponents?.forEach(kc => kc.statistics = summary.kcStatistics.satisfiedKcStatistics.find(s => s.kcId === kc.id));
      relatedUnit.tasks?.forEach(t => t.statistics = summary.taskStatistics.taskStatistics.find(s => s.taskId === t.id));
      relatedUnit.reflections.forEach(r => {
        r.selectedLearnerSubmission = r.submissions.find(s => s.learnerId === this.selectedLearnerId);
        r.questions.forEach(q => q.answer = r.selectedLearnerSubmission?.answers.find(a => a.questionId === q.id)?.answer);
      });
      updateTimelineItems(relatedUnit);
    });

    this.weeklyResults = calculateWeeklyProgressStatistics(this.units);
  }

  public changeLearner(direction: number) {
    const currentLearner = this.learners.find(learner => learner.id == this.selectedLearnerId);
    const currentIndex = this.learners.indexOf(currentLearner);
    const newIndex = (currentIndex + direction + this.learners.length) % this.learners.length;
    this.selectedLearnerId = this.learners[newIndex].id;
    this.learnerChanged.emit(this.learners[newIndex]);
  }
}