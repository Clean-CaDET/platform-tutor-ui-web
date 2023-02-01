import { Entity } from 'src/app/shared/generics/model/entity.model';
import { StakeholderAccount } from './stakeholder-account.model';

export interface Group extends Entity{
  courseId: string;
  name: string;
  learners: StakeholderAccount[];
}
