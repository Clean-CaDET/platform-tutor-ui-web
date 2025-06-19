import { KCMastery } from "./knowledge-component-mastery.model";
import { KnowledgeComponent } from "./knowledge-component.model";
import { TaskProgressSummary } from "./task-progress-summary";

export interface UnitItem {
  id: number;
  order: number;
  name: string;
  type: UnitItemType;
  isSatisfied: boolean;
  isNext: boolean;

  kc?: KnowledgeComponent;
  kcMastery?: KCMastery;

  task?: TaskProgressSummary;
}

export enum UnitItemType {
  Kc = 1,
  Task,
  Reflection
}