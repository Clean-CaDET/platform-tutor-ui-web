import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
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
