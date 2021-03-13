import { KnowledgeType } from '../enum/knowledge-type.enum';
import { LearningObject } from '../learning-objects/model/learning-object.model';

export class KnowledgeNode {
  type: KnowledgeType;
  learningObjects: LearningObject[];
}
