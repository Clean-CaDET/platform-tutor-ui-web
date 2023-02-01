import { Submission } from '../submission.model';
import { ArrangeTaskContainerSubmission } from './arrange-task-container-submission.model';

export interface ArrangeTaskSubmission extends Submission {
  containers: ArrangeTaskContainerSubmission[];
}
