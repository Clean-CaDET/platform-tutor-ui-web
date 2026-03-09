import { Entity } from '../../../shared/generics/model/entity.model';

export interface StakeholderAccount extends Entity {
  email: string;
  name: string;
  surname: string;
  index: string;
  isArchived: boolean;
  userId: number;
  userType: string;
}
