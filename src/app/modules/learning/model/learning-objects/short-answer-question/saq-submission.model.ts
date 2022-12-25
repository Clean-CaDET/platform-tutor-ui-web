import { Submission } from "../submission.model";

export interface SaqSubmission extends Submission {
  answer: string;
}
