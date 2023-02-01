export interface Evaluation {
  typeDiscriminator: string;
  correctnessLevel: number;
}

export const evaluationTypes = {
  arrangeTask: 'atEvaluation',
  mutlipleChoiceQuestion: 'mcqEvaluation',
  mutlipleResponseQuestion: 'mrqEvaluation',
  shortAnswerQuestion: 'saqEvaluation',
};
