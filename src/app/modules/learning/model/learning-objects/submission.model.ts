export interface Submission {
  typeDiscriminator: string;
}

export const submissionTypes = {
  arrangeTask: 'atSubmission',
  mutlipleChoiceQuestion: 'mcqSubmission',
  mutlipleResponseQuestion: 'mrqSubmission',
  shortAnswerQuestion: 'saqSubmission',
};
