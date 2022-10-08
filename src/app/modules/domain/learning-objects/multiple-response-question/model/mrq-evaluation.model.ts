import {MrqItemEvaluation} from './mrq-item-evaluation.model';

export class MrqEvaluation {
  itemEvaluations: MrqItemEvaluation[];
  correctnessLevel: number;

  constructor(obj?: any) {
    if (obj) {
      this.correctnessLevel = obj.correctnessLevel;
      this.itemEvaluations = obj.itemEvaluations
        .map(itemEvaluations => new MrqItemEvaluation(itemEvaluations));
    }
  }
}
