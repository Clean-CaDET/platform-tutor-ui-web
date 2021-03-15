import { LearningObject } from '../../model/learning-object.model';
import { TextComponent } from '../text.component';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { LearningObjectRole } from '../../enum/learning-object-role.enum';

export class Text extends LearningObject{
  text: string;

  constructor(text?: string, role?: LearningObjectRole, tags?: string[]) {
    super(role, tags);
    this.text = text;
  }

  getComponent(): Type<LearningObjectComponent> {
    return TextComponent;
  }
}
