import { CcqItem } from '../../../knowledge-component/learning-objects/assessment-items/code-completion-question/model/ccq.model';
import { Evaluation } from '../evaluation.model';

export interface CcqEvaluation extends Evaluation {
  items: CcqItem[];
  feedback: string;
}
