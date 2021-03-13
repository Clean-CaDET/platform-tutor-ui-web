import { Type } from '@angular/core';
import { LearningObjectRole } from '../enum/learning-object-role.enum';
import { LearningObjectComponent } from '../learning-object-component';

export abstract class LearningObject {
  role: LearningObjectRole;
  tags: string[];

  abstract getComponent(): Type<LearningObjectComponent>;

}
