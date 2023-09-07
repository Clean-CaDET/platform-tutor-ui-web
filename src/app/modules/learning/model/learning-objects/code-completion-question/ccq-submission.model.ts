import { CcqItem } from '../../../knowledge-component/learning-objects/assessment-items/code-completion-question/model/ccq.model';
import { Submission } from '../submission.model';

export interface CcqSubmission extends Submission {
  items: CcqItem[];
}
