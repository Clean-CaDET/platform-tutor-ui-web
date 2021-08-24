import { LearningObject } from '../../model/learning-object.model';
import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { VideoComponent } from '../video.component';

export class Video extends LearningObject {

  url: string;

  constructor(obj?: any) {
    if (obj) {
      obj.TypeDiscriminator = 'video';
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
