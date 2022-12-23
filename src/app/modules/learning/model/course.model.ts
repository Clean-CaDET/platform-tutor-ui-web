import { Unit } from './unit.model';

export interface Course {
  id: number;
  name: string;
  description: string;
  knowledgeUnits: Unit[];
}
