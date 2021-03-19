import { KnowledgeType } from '../enum/knowledge-type.enum';
import { LearningObject } from '../learning-objects/model/learning-object.model';

export class KnowledgeNode {
  id: number;
  type: KnowledgeType;
  description: string;
  prerequisites: KnowledgeNode[];
  learningObjects: LearningObject[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.type = obj.type;
      this.description = obj.description;
      this.prerequisites = obj.prerequisites;
      this.learningObjects = obj.learningObjects;
    }
  }
}
