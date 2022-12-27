import { KnowledgeComponent } from "./knowledge-component.model";

export interface Unit {
  id?: number;
  code: string;
  name: string;
  description: string;
  knowledgeComponents?: KnowledgeComponent[];
}
