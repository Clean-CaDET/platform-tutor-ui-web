import { SupervisionGroup } from './group.model';

export interface SupervisionCourse {
  id?: number;
  code: string;
  name: string;
  startDate: Date;
  groups?: SupervisionGroup[];
}
