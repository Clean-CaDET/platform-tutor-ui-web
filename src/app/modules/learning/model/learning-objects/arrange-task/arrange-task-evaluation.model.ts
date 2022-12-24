import {ArrangeTaskContainerEvaluation} from './arrange-task-container-evaluation.model';

export interface ArrangeTaskEvaluation {
  containerEvaluations: ArrangeTaskContainerEvaluation[];
  correctnessLevel: number;
}
