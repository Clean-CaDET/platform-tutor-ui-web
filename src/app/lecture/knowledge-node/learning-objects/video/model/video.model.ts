import { LearningObject } from '../../model/learning-object.model';
import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { VideoComponent } from '../video.component';
import { LearningObjectRole } from '../../enum/learning-object-role.enum';

export class Video extends LearningObject {

  videoId: string;

  constructor(videoId?: string, role?: LearningObjectRole, tags?: string[]) {
    super(role, tags);
    this.videoId = videoId;
  }

  getComponent(): Type<LearningObjectComponent> {
    return VideoComponent;
  }
}
