import { Submission } from '../submission.model';

export interface McqSubmission extends Submission {
  answer: string;
}
