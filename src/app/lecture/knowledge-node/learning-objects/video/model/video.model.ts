import { LearningObject } from '../../model/learning-object.model';
import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { VideoComponent } from '../video.component';

export class Video extends LearningObject {

  videoId: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.videoId = obj.videoId;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return VideoComponent;
  }
}
