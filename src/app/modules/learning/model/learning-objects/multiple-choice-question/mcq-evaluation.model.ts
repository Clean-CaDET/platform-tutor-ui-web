import { Evaluation } from '../evaluation.model';

export interface McqEvaluation extends Evaluation {
  correctAnswer: string;
  feedback: string;
}
