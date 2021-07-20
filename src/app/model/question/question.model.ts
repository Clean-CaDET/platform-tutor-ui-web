import { LearningObject } from '../learning-object/learning-object.model';
import { LearningObjectComponent } from '../../modules/lecture/learning-objects/learning-object-component';
import { Type } from '@angular/core';
import { QuestionComponent } from '../../modules/lecture/learning-objects/question/question.component';
import { Answer } from './answer.model';

export class Question extends LearningObject {

  text: string;
  possibleAnswers: Answer[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.possibleAnswers = obj.possibleAnswers;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return QuestionComponent;
  }
}
