export interface Evaluation {
  $type: string;
  correctnessLevel: number;
  correct: boolean;
}

export const evaluationTypes = {
  mutlipleChoiceQuestion: 'mcqEvaluation',
  mutlipleResponseQuestion: 'mrqEvaluation',
  shortAnswerQuestion: 'saqEvaluation',
};
