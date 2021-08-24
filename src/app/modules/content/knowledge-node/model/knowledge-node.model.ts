import { KnowledgeType } from './knowledge-type.enum';
import { LearningObject } from '../../learning-objects/model/learning-object.model';
import { NodeStatus } from './node-status.enum';
import {LearningObjectSummary} from '../../learning-object-summary/model/learning-object-summary';

export class KnowledgeNode {
  id: number;
  type: KnowledgeType;
  learningObjective: string;
  prerequisites: KnowledgeNode[];
  learningObjects: LearningObject[];
  learningObjectSummaries: LearningObjectSummary[];
  status: NodeStatus;
  lectureId: number;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.type = obj.type;
      this.learningObjective = obj.learningObjective;
      this.prerequisites = obj.prerequisites;
      this.learningObjects = obj.learningObjects;
      this.status = obj.status;
      this.lectureId = obj.lectureId;
      this.learningObjectSummaries = obj.learningObjectSummaries;
    }
  }
}
