import { LearningObject } from '../learning-object/learning-object.model';
import { LearningObjectComponent } from '../../modules/content/learning-objects/learning-object-component';
import { Type } from '@angular/core';
import { ChallengeComponent } from '../../modules/content/learning-objects/challenge/challenge.component';

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
