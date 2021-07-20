import { LearningObject } from '../learning-object/learning-object.model';
import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../modules/lecture/learning-objects/learning-object-component';
import { VideoComponent } from '../../modules/lecture/learning-objects/video/video.component';

export class Video extends LearningObject {

  url: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.url = obj.url;
    }
  }

  getVideoId(): string {
    return this.url.split('/').pop().slice(-11);
  }

  getComponent(): Type<LearningObjectComponent> {
    return VideoComponent;
  }
}
