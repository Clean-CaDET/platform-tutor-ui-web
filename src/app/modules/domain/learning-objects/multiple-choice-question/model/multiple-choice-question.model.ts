import { LearningObject } from '../../learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { MultipleChoiceQuestionComponent } from '../multiple-choice-question.component';

export class MultipleChoiceQuestion extends LearningObject {
  text: string;
  possibleAnswers: string[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.possibleAnswers = obj.possibleAnswers;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return MultipleChoiceQuestionComponent;
  }
}
