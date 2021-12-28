export class KnowledgeComponent {
  id: number;
  name: string;
  description: string;
  knowledgeComponents: KnowledgeComponent[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.knowledgeComponents = obj.knowledgeComponents.map(kc => new KnowledgeComponent(kc));
    }
  }
}
