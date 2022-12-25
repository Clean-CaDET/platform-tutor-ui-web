import { Evaluation } from '../evaluation.model';
import { ArrangeTaskContainerEvaluation } from './arrange-task-container-evaluation.model';

export interface ArrangeTaskEvaluation extends Evaluation {
  containerEvaluations: ArrangeTaskContainerEvaluation[];
}
