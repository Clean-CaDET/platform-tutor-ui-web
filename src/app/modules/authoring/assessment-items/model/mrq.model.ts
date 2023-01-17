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

interface MrqItem {
    id: number;
    text: string;
    isCorrect: boolean;
    feedback: string;
}