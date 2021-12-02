import {KnowledgeComponent} from '../../knowledge-component/model/knowledge-component.model';

export class Unit {
  id: number;
  name: string;
  description: string;
  private knowledgeComponents: KnowledgeComponent[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.knowledgeComponents = obj.knowledgeComponents;
    }
  }
}
