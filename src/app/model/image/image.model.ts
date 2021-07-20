import { LearningObject } from '../learning-object/learning-object.model';
import { LearningObjectComponent } from '../../modules/lecture/learning-objects/learning-object-component';
import { Type } from '@angular/core';
import { ImageComponent } from '../../modules/lecture/learning-objects/image/image.component';

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
