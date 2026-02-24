import { Evaluation } from './evaluation.model';

export interface Feedback {
  type: 'Pump' | 'Hint' | 'Correctness' | 'Solution' | 'Error';
  hint?: string;
  evaluation?: Evaluation;
}
