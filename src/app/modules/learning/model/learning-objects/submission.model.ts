export interface Submission {
  $type: string;
  reattemptCount: number;
}

export const submissionTypes = {
  arrangeTask: 'atSubmission',
  mutlipleChoiceQuestion: 'mcqSubmission',
  mutlipleResponseQuestion: 'mrqSubmission',
  shortAnswerQuestion: 'saqSubmission',
};
