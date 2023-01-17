import { AssessmentItem } from "./assessment-item.model";

export class ShortAnswerQuestion extends AssessmentItem {
    acceptableAnswers: string[];

    constructor(obj?: any) {
      if (obj) {
        super(obj);
        this.acceptableAnswers = obj.acceptableAnswers;
      }
    }
}