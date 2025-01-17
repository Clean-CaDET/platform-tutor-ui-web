import { KCMastery } from "./knowledge-component-mastery.model";
import { KnowledgeComponent } from "./knowledge-component.model";
import { TaskProgressSummary } from "./task-progress-summary";

export interface UnitItem {
  id: number;
  order: number;
  isKc: boolean;
  isSatisfied: boolean;
  isNext: boolean;

  kc?: KnowledgeComponent;
  kcMastery?: KCMastery;

  task?: TaskProgressSummary;
}