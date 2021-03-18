import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';

export class Lecture {
  id: number;
  name: string;
  description: string;
  knowledgeNodes: KnowledgeNode[];
}
