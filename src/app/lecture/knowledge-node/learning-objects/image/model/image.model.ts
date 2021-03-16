import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { LearningObjectRole } from '../../enum/learning-object-role.enum';
import { ImageComponent } from '../image.component';

export class Image extends LearningObject {

  url: string;
  caption: string;

  constructor(url?: string, caption?: string, role?: LearningObjectRole, tags?: string[]) {
    super(role, tags);
    this.url = url;
    this.caption = caption;
  }

  getComponent(): Type<LearningObjectComponent> {
    return ImageComponent;
  }
}
