export interface SubmissionStatistics {
  count: number;
  submission: Submission;
}

export interface Submission {
  $type: 'saqSubmission' | 'mcqSubmission' | 'mrqSubmission';
  answer?: string;
  answers?: { text: string }[];
}
