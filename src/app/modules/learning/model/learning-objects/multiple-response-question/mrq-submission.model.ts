import { Submission } from '../submission.model';
import { MrqItem } from './mrq-item.model';

export interface MrqSubmission extends Submission {
  answers: MrqItem[];
}
