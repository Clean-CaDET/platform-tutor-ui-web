import { LearningObject } from '../learning-object.model';
import { LearningObjectComponent } from '../learning-object-component';
import { Type } from '@angular/core';
import { ShortAnswerQuestionComponent } from './short-answer-question.component';

export class ShortAnswerQuestion extends LearningObject {

  text: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ShortAnswerQuestionComponent;
  }
}
