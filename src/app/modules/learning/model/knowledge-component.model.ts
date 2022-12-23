import {KCMastery} from './knowledge-component-mastery.model';

export interface KnowledgeComponent {
  id: number;
  name: string;
  code: string;
  description: string;
  expectedDurationInMinutes: number;
  knowledgeComponents: KnowledgeComponent[];
  mastery: KCMastery;
}
