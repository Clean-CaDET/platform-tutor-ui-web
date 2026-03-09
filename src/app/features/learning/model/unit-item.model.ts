import { KnowledgeComponent } from './knowledge-component.model';
import { KcMastery } from './kc-mastery.model';
import { TaskProgressSummary } from './task-progress-summary.model';

export enum UnitItemType {
  Kc = 1,
  Task,
  Reflection,
}

interface BaseUnitItem {
  id: number;
  order: number;
  name: string;
  isSatisfied: boolean;
  isNext: boolean;
}

export interface KcUnitItem extends BaseUnitItem {
  type: UnitItemType.Kc;
  kc: KnowledgeComponent;
  kcMastery: KcMastery;
}

export interface TaskUnitItem extends BaseUnitItem {
  type: UnitItemType.Task;
  task: TaskProgressSummary;
}

export interface ReflectionUnitItem extends BaseUnitItem {
  type: UnitItemType.Reflection;
}

export type UnitItem = KcUnitItem | TaskUnitItem | ReflectionUnitItem;
