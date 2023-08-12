import { Unit } from './unit.model';

export interface Course {
  id?: number;
  code: string;
  name: string;
  description: string;
  startDate: Date;
  knowledgeUnits?: Unit[];
}
