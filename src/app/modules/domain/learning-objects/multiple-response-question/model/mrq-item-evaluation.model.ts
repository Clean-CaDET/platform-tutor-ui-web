export class MrqItemEvaluation {
  id: number;
  text: string;
  feedback: string;
  submissionWasCorrect: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.text = obj.text;
      this.feedback = obj.feedback;
      this.submissionWasCorrect = obj.submissionWasCorrect;
    }
  }
}
