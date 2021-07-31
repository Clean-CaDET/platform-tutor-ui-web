export class LectureModel {
  id: number;
  name: string;
  description: string;
  courseId: number;
  knowledgeNodeIds: number[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.description = obj.description;
      this.courseId = obj.courseId;
      this.knowledgeNodeIds = obj.knowledgeNodeIds;
    }
  }
}
