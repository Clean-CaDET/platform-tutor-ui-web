import { MrqItem } from './learning-object.model';

interface BaseSubmission {
  reattemptCount: number;
}

export interface McqSubmission extends BaseSubmission {
  $type: 'mcqSubmission';
  answer: string;
}

export interface MrqSubmission extends BaseSubmission {
  $type: 'mrqSubmission';
  answers: MrqItem[];
}

export interface SaqSubmission extends BaseSubmission {
  $type: 'saqSubmission';
  answer: string;
}

export type Submission = McqSubmission | MrqSubmission | SaqSubmission;
