import { KnowledgeComponent } from "./knowledge-component.model";

export interface Unit {
  id?: number;
  courseId?: number;
  code: string;
  name: string;
  introduction?: string;
  goals: string;
  guidelines?: string;
  order: number;
  knowledgeComponents?: KnowledgeComponent[];
}
