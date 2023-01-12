import { Type } from '@angular/core';
import { LearningObjectComponent } from './learning-object-component';

export abstract class LearningObject {
  id: number;
  typeDiscriminator: string;

  protected constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.typeDiscriminator = obj.typeDiscriminator;
    }
  }

  abstract getComponent(): Type<LearningObjectComponent>;

}
