import { Entity } from 'src/app/shared/generics/model/entity';
import { StakeholderAccount } from './stakeholder-account';

export interface Group extends Entity{
  courseId: string;
  name: string;
  learners: StakeholderAccount[];
}
