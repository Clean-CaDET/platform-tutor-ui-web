export interface Evaluation {
  $type: string;
  correctnessLevel: number;
  correct: boolean;
}

export const evaluationTypes = {
  arrangeTask: 'atEvaluation',
  mutlipleChoiceQuestion: 'mcqEvaluation',
  mutlipleResponseQuestion: 'mrqEvaluation',
  shortAnswerQuestion: 'saqEvaluation',
};
