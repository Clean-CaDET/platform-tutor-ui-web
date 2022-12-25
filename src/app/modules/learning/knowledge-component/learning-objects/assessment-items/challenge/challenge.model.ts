import { Type } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
import { ChallengeComponent } from './challenge.component';

export class Challenge extends LearningObject {

  description: string;
  url: string;

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.description = obj.description;
      this.url = obj.url;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ChallengeComponent;
  }
}
