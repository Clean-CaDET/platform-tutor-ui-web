export class Lecture {
  id: number;
  name: string;
  description: string;
  knowledgeNodeIds: number[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.knowledgeNodeIds = obj.knowledgeNodeIds;
    }
  }
}
