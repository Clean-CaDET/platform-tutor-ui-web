import { Type } from '@angular/core';
import { LearningObjectComponent } from './learning-object-component';

export abstract class LearningObject {
  id: number;

  protected constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
    }
  }

  abstract getComponent(): Type<LearningObjectComponent>;

}
