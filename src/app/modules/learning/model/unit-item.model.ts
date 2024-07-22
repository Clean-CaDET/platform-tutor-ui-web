import { LearningTask } from "../task/model/learning-task";
import { KCMastery } from "./knowledge-component-mastery.model";
import { KnowledgeComponent } from "./knowledge-component.model";

export interface UnitItem {
  order: number;
  isKc: boolean;
  isSatisfied: boolean;
  isNext: boolean;

  kc?: KnowledgeComponent;
  kcMastery?: KCMastery;
  
  task?: LearningTask;
}