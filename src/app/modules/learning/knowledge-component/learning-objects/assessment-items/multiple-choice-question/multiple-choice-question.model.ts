import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
import { MultipleChoiceQuestionComponent } from './multiple-choice-question.component';

export class MultipleChoiceQuestion extends LearningObject {
  text: string;
  possibleAnswers: string[];
  correctAnswer: string;
  feedback: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.possibleAnswers = obj.possibleAnswers;
      this.correctAnswer = obj.correctAnswer;
      this.feedback = obj.feedback;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return MultipleChoiceQuestionComponent;
  }
}
