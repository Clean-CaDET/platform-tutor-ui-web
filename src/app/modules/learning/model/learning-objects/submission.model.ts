export interface Submission {
  typeDiscriminator: string;
  reattemptCount: number;
}

export const submissionTypes = {
  arrangeTask: 'atSubmission',
  mutlipleChoiceQuestion: 'mcqSubmission',
  mutlipleResponseQuestion: 'mrqSubmission',
  shortAnswerQuestion: 'saqSubmission',
};
