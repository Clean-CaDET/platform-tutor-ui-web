import { LearningObject } from '../learning-object.model';
import { LearningObjectComponent } from '../learning-object-component';
import { Type } from '@angular/core';
import { ImageComponent } from './image.component';

export class Image extends LearningObject {

  url: string;
  caption: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.url = obj.url;
      this.caption = obj.caption;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ImageComponent;
  }
}
