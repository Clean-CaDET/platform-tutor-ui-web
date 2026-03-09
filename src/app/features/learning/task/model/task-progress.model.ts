import { StepProgress } from './step-progress.model';

export interface TaskProgress {
  id?: number;
  totalScore: number;
  status: string;
  stepProgresses?: StepProgress[];
  learningTaskId: number;
  learnerId: number;
}
