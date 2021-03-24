import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { Answer } from './answer.model';

export class Question extends LearningObject {

  text: string;
  answers: Answer[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.answers = obj.answers;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return QuestionComponent;
  }
}
