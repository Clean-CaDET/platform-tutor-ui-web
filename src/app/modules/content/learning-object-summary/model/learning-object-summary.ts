import {KnowledgeNode} from '../../knowledge-node/model/knowledge-node.model';
import {LearningObject} from '../../learning-objects/model/learning-object.model';

export class LearningObjectSummary {
  description: string;
  id: number;
  knowledgeNode: KnowledgeNode;
  learningObjects: LearningObject[];


  constructor(obj: any) {
    this.description = obj.description;
    this.id = obj.id;
    this.knowledgeNode = obj.knowledgeNode;
    this.learningObjects = obj.learningObjects;
  }
}
