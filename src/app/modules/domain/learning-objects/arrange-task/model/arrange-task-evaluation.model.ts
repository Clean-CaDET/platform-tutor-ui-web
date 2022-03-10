
import {ArrangeTaskContainerEvaluation} from './arrange-task-container-evaluation.model';

export class ArrangeTaskEvaluation {

  containerEvaluations: ArrangeTaskContainerEvaluation[];
  correctnessLevel: number;

  constructor(obj?: any) {
    if (obj) {
      this.correctnessLevel = obj.correctnessLevel.toFixed(2);
      this.containerEvaluations = obj.containerEvaluations
        .map(containerEvaluation => new ArrangeTaskContainerEvaluation(containerEvaluation));
    }
  }
}
