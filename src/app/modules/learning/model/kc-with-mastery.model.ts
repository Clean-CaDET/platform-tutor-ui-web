import {KnowledgeComponent} from "./knowledge-component.model";
import {KCMastery} from "./knowledge-component-mastery.model";

export interface KcWithMastery {
  knowledgeComponent: KnowledgeComponent,
  mastery: KCMastery
}
