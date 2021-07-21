import { KnowledgeType } from './knowledge-type.enum';
import { LearningObject } from '../../learning-objects/model/learning-object.model';
import { NodeStatus } from './node-status.enum';

export class KnowledgeNode {
  id: number;
  type: KnowledgeType;
  learningObjective: string;
  prerequisites: KnowledgeNode[];
  learningObjects: LearningObject[];
  status: NodeStatus;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.type = obj.type;
      this.learningObjective = obj.learningObjective;
      this.prerequisites = obj.prerequisites;
      this.learningObjects = obj.learningObjects;
      this.status = obj.status;
    }
  }
}
