import {KnowledgeNode} from '../../knowledge-node/model/knowledge-node.model';
import {LearningObject} from '../../learning-objects/model/learning-object.model';

export class LearningObjectSummary {
  description: string;
  id: number;
  knowledgeNodeId: KnowledgeNode;
  learningObjects: LearningObject[];


  constructor(obj: any) {
    this.description = obj.description;
    this.id = obj.id;
    this.knowledgeNodeId = obj.knowledgeNodeId;
    this.learningObjects = obj.learningObjects;
  }
}
