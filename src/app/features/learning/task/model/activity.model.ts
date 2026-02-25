import { ActivityExample } from './activity-example.model';
import { SubmissionFormat } from './submission-format.model';
import { Standard } from './standard.model';
import { StepProgress } from './step-progress.model';

export interface Activity {
  id?: number;
  parentId?: number;
  order: number;
  code: string;
  name: string;
  guidance: string;
  examples?: ActivityExample[];
  submissionFormat: SubmissionFormat;
  standards?: Standard[];
  maxPoints?: number;
  subactivities?: Activity[];
  progress: StepProgress;
}
