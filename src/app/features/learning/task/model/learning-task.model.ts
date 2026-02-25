import { Activity } from './activity.model';

export interface LearningTask {
  id?: number;
  unitId?: number;
  name: string;
  description?: string;
  order?: number;
  isTemplate: boolean;
  steps?: Activity[];
  maxPoints?: number;
}
