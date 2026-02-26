import { Component, ChangeDetectionStrategy, inject, input, output, signal, computed } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs';

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

  readonly questionGroups = toSignal(inject(WeeklyFeedbackQuestionsService).getAll(), { initialValue: [] });
  readonly filterReflections = signal(false);

  private readonly groupMemberIds = computed(() => new Set(this.learners().map(l => l.id)));

  private readonly rawUnits = rxResource({
    params: () => ({ courseId: this.courseId(), learnerId: this.selectedLearnerId(), date: this.selectedDate() }),
    stream: ({ params }) => this.weeklyActivityService.getWeeklyUnitsWithItems(params.courseId, params.learnerId, params.date)
      .pipe(map(units => units.sort((a, b) => a.order - b.order))),
    defaultValue: [],
  });

  private readonly statistics = rxResource({
    params: () => {
      const rawUnits = this.rawUnits.value();
      if (!rawUnits.length) return undefined;
      return {
        unitIds: rawUnits.map(u => u.id),
        learnerId: this.selectedLearnerId(),
        groupMemberIds: [...this.groupMemberIds()],
      };
    },
    stream: ({ params }) => this.weeklyActivityService.getTaskAndKcStatistics(params.unitIds, params.learnerId, params.groupMemberIds),
    defaultValue: [],
  });

  readonly units = computed(() => this.mergeStatistics(this.rawUnits.value(), this.statistics.value()));

  readonly readyForFeedback = computed(() => {
    if (!this.rawUnits.value().length) return false;
    const status = this.statistics.status();
    return status === 'resolved' || status === 'local';
  });

  readonly weeklyResults = computed(() => calculateWeeklyProgressStatistics(this.units()));
  readonly reflectionIds = computed(() =>
    this.units()
      .flatMap(unit => unit.reflections || [])
      .map(reflection => reflection.id)
      .filter(id => id != null),
  );

  private mergeStatistics(rawUnits: UnitHeader[], unitSummaries: UnitProgressStatistics[]): UnitHeader[] {
    if (!unitSummaries.length) return rawUnits;

    return rawUnits.map(unit => {
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
  }

  filterItems(timelineItems: TimelineItem[]): readonly TimelineItem[] {
    if (!this.filterReflections() || !this.weeklyResults().avgSatisfaction) return timelineItems;
    return timelineItems.filter(i => i.type === 'reflection');
  }

  asKc(item: TimelineItem): KcHeader { return item.item as KcHeader; }
  asTask(item: TimelineItem): TaskHeader { return item.item as TaskHeader; }
  asReflection(item: TimelineItem): Reflection { return item.item as Reflection; }

  changeLearner(direction: number): void {
    const next = getAdjacentLearner(this.learners(), this.selectedLearnerId(), direction);
    if (next) this.learnerChanged.emit(next);
  }
}
