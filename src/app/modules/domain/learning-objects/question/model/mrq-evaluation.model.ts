import {MrqItemEvaluation} from './mrq-item-evaluation.model';

export class MrqEvaluation {
  itemEvaluations: MrqItemEvaluation[];
  correctnessLevel: number;

  constructor(obj?: any) {
    if (obj) {
      this.correctnessLevel = Math.round(obj.correctnessLevel * 100) / 100 * 100;
      this.itemEvaluations = obj.itemEvaluations
        .map(itemEvaluations => new MrqItemEvaluation(itemEvaluations));
    }
  }
}
