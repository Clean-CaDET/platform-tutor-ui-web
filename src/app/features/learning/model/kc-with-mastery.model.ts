import { KnowledgeComponent } from './knowledge-component.model';
import { KcMastery } from './kc-mastery.model';

export interface KcWithMastery {
  knowledgeComponent: KnowledgeComponent;
  mastery: KcMastery;
}
