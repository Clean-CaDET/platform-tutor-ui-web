import { Unit } from './unit.model';

export interface Course {
  id?: number;
  code: string;
  name: string;
  isArchived?: boolean;
  description: string;
  startDate: Date;
  knowledgeUnits?: Unit[];
}
