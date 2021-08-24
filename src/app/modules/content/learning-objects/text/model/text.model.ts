import { LearningObject } from '../../model/learning-object.model';
import { TextComponent } from '../text.component';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';

export class Text extends LearningObject {
  content: string;

  constructor(obj?: any) {
    if (obj) {
      obj.TypeDiscriminator = 'text';
      super(obj);
      this.content = obj.content;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return TextComponent;
  }
}
