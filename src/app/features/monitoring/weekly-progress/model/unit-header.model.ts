import { Reflection } from '../../../learning/reflection/reflection.model';
import { KcProgressStatistics, KcStatistics, TaskProgressStatistics, TaskStatistics } from './unit-statistics.model';

export interface UnitHeader {
  id: number;
  name: string;
  order: number;
  bestBefore: Date;
  knowledgeComponents: KcHeader[];
  tasks: TaskHeader[];
  reflections: Reflection[];

  kcStatistics?: KcProgressStatistics;
  taskStatistics?: TaskProgressStatistics;

  timelineItems: TimelineItem[];
}

export interface TaskHeader {
  id: number;
  name: string;
  order: number;
  maxPoints: number;
  statistics?: TaskStatistics;
}

export interface KcHeader {
  id: number;
  name: string;
  order: number;
  statistics?: KcStatistics;
}

export type TimelineItem =
  | { type: 'kc'; item: KcHeader; time: Date }
  | { type: 'task'; item: TaskHeader; time: Date }
  | { type: 'reflection'; item: Reflection; time: Date };

export function updateTimelineItems(unit: UnitHeader): void {
  unit.timelineItems = [];
  unit.knowledgeComponents?.forEach(kc => {
    if (!kc.statistics?.satisfactionTime) return;
    unit.timelineItems.push({ type: 'kc', item: kc, time: new Date(kc.statistics.satisfactionTime) });
  });
  unit.tasks?.forEach(t => {
    if (!t.statistics?.completionTime) return;
    unit.timelineItems.push({ type: 'task', item: t, time: new Date(t.statistics.completionTime) });
  });
  unit.reflections?.forEach(r => {
    if (!r.selectedLearnerSubmission) return;
    unit.timelineItems.push({ type: 'reflection', item: r, time: new Date(r.selectedLearnerSubmission.created!) });
  });
  unit.timelineItems.sort((a, b) => a.time.getTime() - b.time.getTime());
}
