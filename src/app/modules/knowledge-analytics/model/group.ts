import {Learner} from './learner';

export interface Group {
  id: number;
  name: string;
  learners: Learner[];
}
