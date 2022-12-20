import {KCMastery} from './knowledge-component-mastery.model';

export class KnowledgeComponent {
  id: number;
  name: string;
  code: string;
  description: string;
  expectedDurationInMinutes: number;
  knowledgeComponents: KnowledgeComponent[];
  mastery: KCMastery;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.expectedDurationInMinutes = obj.expectedDurationInMinutes;
      this.code = obj.code;
      this.knowledgeComponents = obj.knowledgeComponents.map(kc => new KnowledgeComponent(kc));
      this.mastery = new KCMastery(obj.mastery);
    }
  }
}
