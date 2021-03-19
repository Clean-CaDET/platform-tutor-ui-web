import { LearningObject } from '../../model/learning-object.model';
import { TextComponent } from '../text.component';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';

export class Text extends LearningObject{
  text: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return TextComponent;
  }
}
