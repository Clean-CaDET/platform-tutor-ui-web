import { SupervisionLearner } from './learner.model';

export interface SupervisionGroup {
  id: number;
  name: string;
  learners?: SupervisionLearner[];
}
