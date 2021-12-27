import {MrqItemEvaluation} from './mrq-item-evaluation.model';

export class MrqEvaluation {
  itemEvaluations: MrqItemEvaluation[];

  constructor(obj?: any) {
    if (obj) {
      this.itemEvaluations = obj.itemEvaluations
        .map(itemEvaluations => new MrqItemEvaluation(itemEvaluations));
    }
  }
}
