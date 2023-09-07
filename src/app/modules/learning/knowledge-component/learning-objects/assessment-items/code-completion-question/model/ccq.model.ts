import { Type } from "@angular/core";
import { LearningObjectComponent } from "../../../learning-object-component";
import { LearningObject } from "../../../learning-object.model";
import { CodeCompletionQuestionComponent } from "../code-completion-question.component";

export class CodeCompletionQuestion extends LearningObject {
  text: string;
  code: string;
  items: CcqItem[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.code = obj.code;
      this.items = obj.items?.map((i: any) => new CcqItem(i));
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return CodeCompletionQuestionComponent;
  }

  splitCode(): string[] {
    return this.code.split(/\$\$\d\$\$/g);
  }
}

export class CcqItem {
  order: number;
  answer: string;
  length: number;

  constructor(obj?: any) {
    this.order = obj.order;
    this.answer = obj.answer;
    this.length = obj.length;
  }
}