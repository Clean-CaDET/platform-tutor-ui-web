import { AssessmentItem } from "./assessment-item.model";

export class ShortAnswerQuestion extends AssessmentItem {
    acceptableAnswers: string[];
    feedback: string;
    tolerance: number;

    constructor(obj?: any) {
      if (obj) {
        super(obj);
        this.acceptableAnswers = obj.acceptableAnswers;
        this.feedback = obj.feedback;
        this.tolerance = obj.tolerance;
      }
    }
}