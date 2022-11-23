import { LearningObject } from '../learning-object.model';
import { TextComponent } from './text.component';
import { LearningObjectComponent } from '../learning-object-component';
import { Type } from '@angular/core';

export class Text extends LearningObject {
  content: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.content = obj.content;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return TextComponent;
  }
}
