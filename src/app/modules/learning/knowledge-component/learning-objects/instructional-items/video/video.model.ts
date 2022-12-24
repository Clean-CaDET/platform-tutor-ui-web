import { LearningObject } from '../../learning-object.model';
import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { VideoComponent } from './video.component';

export class Video extends LearningObject {

  url: string;
  caption: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.url = obj.url;
      this.caption = obj.caption;
    }
  }

  getVideoId(): string {
    return this.url.split('/').pop().slice(-11);
  }

  getComponent(): Type<LearningObjectComponent> {
    return VideoComponent;
  }
}
