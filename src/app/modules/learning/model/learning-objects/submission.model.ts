export interface Submission {
  $type: string;
  reattemptCount: number;
}

export const submissionTypes = {
  mutlipleChoiceQuestion: 'mcqSubmission',
  mutlipleResponseQuestion: 'mrqSubmission',
  shortAnswerQuestion: 'saqSubmission',
};
