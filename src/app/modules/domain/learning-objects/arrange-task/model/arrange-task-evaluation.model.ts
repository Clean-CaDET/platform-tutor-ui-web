
import {ArrangeTaskContainerEvaluation} from './arrange-task-container-evaluation.model';

export class ArrangeTaskEvaluation {

  containerEvaluations: ArrangeTaskContainerEvaluation[];

  constructor(obj?: any) {
    if (obj) {
      this.containerEvaluations = obj.containerEvaluations
        .map(containerEvaluation => new ArrangeTaskContainerEvaluation(containerEvaluation));
    }
  }
}
