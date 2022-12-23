import { KnowledgeComponent } from "./knowledge-component.model";

export interface Unit {
  id: number;
  name: string;
  description: string;
  knowledgeComponents: KnowledgeComponent[];
}
