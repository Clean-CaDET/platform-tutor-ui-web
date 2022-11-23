import {KCMastery} from './knowledge-component-mastery.model';

export class KnowledgeComponent {
  id: number;
  name: string;
  description: string;
  knowledgeComponents: KnowledgeComponent[];
  mastery: KCMastery;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.knowledgeComponents = obj.knowledgeComponents.map(kc => new KnowledgeComponent(kc));
      this.mastery = new KCMastery(obj.mastery);
    }
  }
}
