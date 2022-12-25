import { Evaluation } from '../evaluation.model';
import { MrqItemEvaluation } from './mrq-item-evaluation.model';

export interface MrqEvaluation extends Evaluation {
  itemEvaluations: MrqItemEvaluation[];
}
