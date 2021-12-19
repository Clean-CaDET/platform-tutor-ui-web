export class KnowledgeComponent {
  id: number;
  name: string;
  description: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
    }
  }
}
