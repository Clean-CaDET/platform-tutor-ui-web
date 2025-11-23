import { Group } from "./group.model";
import { Unit } from "./unit.model";

export interface Course {
  id?: number;
  code: string;
  name: string;
  startDate: Date;

  knowledgeUnits?: Unit[];
  groups?: Group[];
}
