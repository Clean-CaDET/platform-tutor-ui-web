import {Learner} from './learner.model';

export interface Group {
  id: number;
  name: string;
  learners: Learner[];
}
