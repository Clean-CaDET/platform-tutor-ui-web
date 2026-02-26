import { Component, ChangeDetectionStrategy, inject, input, output, signal, computed, effect, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Reflection } from '../../learning/reflection/reflection.model';
import { Learner, getAdjacentLearner } from '../model/learner.model';
import { WeeklyActivityService } from './weekly-activity.service';
import { KcHeader, TaskHeader, TimelineItem, UnitHeader, updateTimelineItems } from './model/unit-header.model';
import { UnitProgressStatistics } from './model/unit-statistics.model';
import { calculateWeeklyProgressStatistics } from './model/weekly-summary.model';
import { WeeklyFeedbackQuestionsService } from '../weekly-feedback/weekly-feedback-questions.service';
import { WeeklyFeedbackComponent } from '../weekly-feedback/weekly-feedback.component';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';

@Component({
  selector: 'cc-weekly-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatCardModule, MatIconModule, MatButtonModule, MatDividerModule,
    MatTooltipModule, MatProgressBarModule, MatCheckboxModule,
    WeeklyFeedbackComponent, CcMarkdownComponent,
  ],
  templateUrl: './weekly-progress.component.html',
  styleUrl: './weekly-progress.component.scss',
})
export class WeeklyProgressComponent {
  private readonly weeklyActivityService = inject(WeeklyActivityService);

  readonly courseId = input.required<number>();
  readonly selectedLearnerId = input.required<number>();
  readonly learners = input.required<Learner[]>();
  readonly selectedDate = input.required<Date>();
  readonly learnerChanged = output<Learner>();

  readonly units = signal<UnitHeader[]>([]);
  readonly readyForFeedback = signal(false);
  readonly questionGroups = toSignal(inject(WeeklyFeedbackQuestionsService).getAll(), { initialValue: [] });
  readonly weeklyResults = computed(() => calculateWeeklyProgressStatistics(this.units()));
  readonly reflectionIds = computed(() =>
    this.units()
      .flatMap(unit => unit.reflections || [])
      .map(reflection => reflection.id)
      .filter(id => id != null),
  );

  readonly filterReflections = signal(false);
  private groupMemberIds = new Set<number>();

  constructor() {
    effect(() => {
      const learners = this.learners();
      untracked(() => {
        this.groupMemberIds = new Set(learners.map(l => l.id));
        if (this.units().length) {
          this.updateUnitItemStatistics();
        }
      });
    });

    effect(() => {
      this.selectedLearnerId();
      untracked(() => {
        if (this.units().length) this.updateUnitItemStatistics();
      });
    });

    effect(() => {
      this.selectedDate();
      untracked(() => this.getUnits());
    });
  }

  private getUnits(invokedByGroupChange = false): void {
    this.weeklyActivityService.getWeeklyUnitsWithItems(this.courseId(), this.selectedLearnerId(), this.selectedDate()).subscribe(units => {
      units.sort((a, b) => a.order - b.order);
      if (this.retrievedUnitsAlreadyLoaded(units)) {
        if (invokedByGroupChange && this.units().length) {
          this.updateUnitItemStatistics();
        }
        return;
      }
      this.units.set(units);
      if (!units.length) return;
      this.updateUnitItemStatistics();
    });
  }

  filterItems(timelineItems: TimelineItem[]): readonly TimelineItem[] {
    if (!this.filterReflections() || !this.weeklyResults().avgSatisfaction) return timelineItems;
    return timelineItems.filter(i => i.type === 'reflection');
  }

  private retrievedUnitsAlreadyLoaded(newUnits: UnitHeader[]): boolean {
    const current = this.units();
    if (current.length === 0 && newUnits.length === 0) return true;
    if (newUnits.length !== current.length) return false;
    return current.every((unit, index) => unit.id === newUnits[index].id);
  }

  private updateUnitItemStatistics(): void {
    if (!this.selectedLearnerId()) return;
    this.readyForFeedback.set(false);
    this.weeklyActivityService.getTaskAndKcStatistics(
      this.units().map(u => u.id), this.selectedLearnerId(), [...this.groupMemberIds],
    ).subscribe(unitSummaries => {
      this.linkAndSummarizeStatistics(unitSummaries);
      this.readyForFeedback.set(true);
    });
  }

  private linkAndSummarizeStatistics(unitSummaries: UnitProgressStatistics[]): void {
    const updatedUnits = this.units().map(unit => {
      const summary = unitSummaries.find(s => s.unitId === unit.id);
      if (!summary) return unit;

      const knowledgeComponents = unit.knowledgeComponents?.map(kc => ({
        ...kc,
        statistics: summary.kcStatistics.satisfiedKcStatistics.find(s => s.kcId === kc.id),
      }));
      const tasks = unit.tasks?.map(t => ({
        ...t,
        statistics: summary.taskStatistics.taskStatistics.find(s => s.taskId === t.id),
      }));
      const reflections = unit.reflections.map(r => {
        const selectedLearnerSubmission = r.submissions?.find(s => s.learnerId === this.selectedLearnerId());
        const questions = r.questions.map(q => ({
          ...q,
          answer: selectedLearnerSubmission?.answers.find(a => a.questionId === q.id)?.answer,
        }));
        return { ...r, selectedLearnerSubmission, questions };
      });

      const updated: UnitHeader = {
        ...unit,
        kcStatistics: summary.kcStatistics,
        taskStatistics: summary.taskStatistics,
        knowledgeComponents: knowledgeComponents ?? [],
        tasks: tasks ?? [],
        reflections,
        timelineItems: [],
      };
      updateTimelineItems(updated);
      return updated;
    });

    this.units.set(updatedUnits);
  }

  asKc(item: TimelineItem): KcHeader { return item.item as KcHeader; }
  asTask(item: TimelineItem): TaskHeader { return item.item as TaskHeader; }
  asReflection(item: TimelineItem): Reflection { return item.item as Reflection; }

  changeLearner(direction: number): void {
    const next = getAdjacentLearner(this.learners(), this.selectedLearnerId(), direction);
    if (next) this.learnerChanged.emit(next);
  }
}
