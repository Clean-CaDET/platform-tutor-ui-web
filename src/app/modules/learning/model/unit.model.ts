import { KnowledgeComponent } from "./knowledge-component.model";

export interface Unit {
  id?: number;
  courseId?: number;
  code: string;
  name: string;
  description: string;
  order: number;
  knowledgeComponents?: KnowledgeComponent[];
}
