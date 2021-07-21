import { LearningObject } from '../learning-object/learning-object.model';
import { TextComponent } from '../../modules/content/learning-objects/text/text.component';
import { LearningObjectComponent } from '../../modules/content/learning-objects/learning-object-component';
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
