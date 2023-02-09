import { Evaluation } from '../evaluation.model';

export interface SaqEvaluation extends Evaluation {
  acceptableAnswers: string[];
  feedback: string;
}
