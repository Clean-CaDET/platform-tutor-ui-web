import { Group } from "./group.model";

export interface Course {
  id?: number;
  code: string;
  name: string;
  startDate: Date;

  groups?: Group[];
}
