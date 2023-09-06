import { AssessmentItem } from "./assessment-item.model";

export class CodeCompletionQuestion extends AssessmentItem {
    code: string;
    items: CcqItem[];
    feedback: string;

    constructor(obj?: any) {
      if (obj) {
        super(obj);
        this.code = obj.code;
        this.items = obj.items?.map((item: any) => new CcqItem(item));
        this.feedback = obj.feedback;
      }
    }

    splitCode(): string[] {
      return this.code.split(/\$\$\d\$\$/g);
    }
}

export class CcqItem {
  order: number;
  answer: string;
  length: number;
  ignoreSpace: boolean;

  constructor(obj?: any) {
    this.order = obj.order;
    this.answer = obj.answer;
    this.length = obj.length;
    this.ignoreSpace = obj.ignoreSpace;
  }
}