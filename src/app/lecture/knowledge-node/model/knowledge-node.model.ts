import { KnowledgeType } from '../enum/knowledge-type.enum';
import { LearningObject } from '../learning-objects/model/learning-object.model';

export class KnowledgeNode {
  id: number;
  type: KnowledgeType;
  description: string;
  prerequisiteFor: KnowledgeNode[];
  learningObjects: LearningObject[];

}
