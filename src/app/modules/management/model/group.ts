import {StakeholderAccount} from './stakeholder-account';

export interface Group {
  id: string;
  courseId: string;
  name: string;
  learners: StakeholderAccount[];
}
