import { Type } from '@angular/core';
import { MrqItem } from 'src/app/modules/learning/model/learning-objects/multiple-response-question/mrq-item.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
import { MultipleResponseQuestionComponent } from './multiple-response-question.component';

export class MultipleReponseQuestion extends LearningObject {

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
    return MultipleResponseQuestionComponent;
  }
}
