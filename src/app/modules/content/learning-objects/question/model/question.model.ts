import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { QuestionComponent } from '../question.component';
import { MrqItem } from './answer.model';

export class Question extends LearningObject {

  text: string;
  items: MrqItem[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.items = obj.items;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return QuestionComponent;
  }
}
