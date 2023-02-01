import { AssessmentItem } from "./assessment-item.model";

export class MultipleChoiceQuestion extends AssessmentItem {
    possibleAnswers: string[];
    correctAnswer: string;
    feedback: string;
  
    constructor(obj?: any) {
      if (obj) {
        super(obj);
        this.text = obj.text;
        this.possibleAnswers = obj.possibleAnswers;
        this.correctAnswer = obj.correctAnswer;
        this.feedback = obj.feedback;
      }
    }
}