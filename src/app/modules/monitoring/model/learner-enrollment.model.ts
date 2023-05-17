import {Learner} from './learner.model';

export interface LearnerEnrollment {
  learner: Learner;
  enrollment: Enrollment;
}

export interface Enrollment {
  learnerId: number;
  start: Date;
  status: string;
}

// Should we bundle interfaces and associate them with the main component/service that uses them?