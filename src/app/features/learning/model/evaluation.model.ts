interface BaseEvaluation {
  correctnessLevel: number;
  correct: boolean;
}

export interface McqEvaluation extends BaseEvaluation {
  $type: 'mcqEvaluation';
  correctAnswer: string;
  feedback: string;
}

export interface MrqItemEvaluation {
  text: string;
  feedback: string;
  submissionWasCorrect: boolean;
}

export interface MrqEvaluation extends BaseEvaluation {
  $type: 'mrqEvaluation';
  itemEvaluations: MrqItemEvaluation[];
}

export interface SaqEvaluation extends BaseEvaluation {
  $type: 'saqEvaluation';
  acceptableAnswers: string[];
  feedback: string;
}

export type Evaluation = McqEvaluation | MrqEvaluation | SaqEvaluation;
