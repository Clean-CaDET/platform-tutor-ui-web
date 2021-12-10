export class Result {
  id: number;
  text: string;
  feedback: string;
  submissionWasCorrect: boolean;

  constructor(obj?: any) {
    this.id = obj.id;
    this.text = obj.text;
    this.feedback = obj.feedbackMap;
    this.submissionWasCorrect = obj.submissionWasCorrect;
  }
}
