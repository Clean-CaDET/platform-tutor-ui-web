import {MrqItemEvaluation} from './mrq-item-evaluation.model';

export interface MrqEvaluation {
  itemEvaluations: MrqItemEvaluation[];
  correctnessLevel: number;
}
