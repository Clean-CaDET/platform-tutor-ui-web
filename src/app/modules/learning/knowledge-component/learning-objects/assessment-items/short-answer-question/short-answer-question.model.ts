import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
import { ShortAnswerQuestionComponent } from './short-answer-question.component';

export class ShortAnswerQuestion extends LearningObject {

  text: string;
  acceptableAnswers: string[];
  feedback: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.acceptableAnswers = obj.acceptableAnswers;
      this.feedback = obj.feedback;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ShortAnswerQuestionComponent;
  }
}
