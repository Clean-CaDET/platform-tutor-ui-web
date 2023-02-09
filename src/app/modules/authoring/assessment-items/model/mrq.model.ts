import { AssessmentItem } from "./assessment-item.model";

export class MultipleReponseQuestion extends AssessmentItem {
    items: MrqItem[];
  
    constructor(obj?: any) {
      if (obj) {
        super(obj);
        this.text = obj.text;
        this.items = obj.items;
      }
    }
}

export interface MrqItem {
    text: string;
    isCorrect: boolean;
    feedback: string;
}