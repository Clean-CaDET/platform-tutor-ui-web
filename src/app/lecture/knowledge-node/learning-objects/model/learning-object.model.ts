import { Type } from '@angular/core';
import { LearningObjectRole } from '../enum/learning-object-role.enum';
import { LearningObjectComponent } from '../learning-object-component';

export abstract class LearningObject {
  id: number;
  role: LearningObjectRole;
  tags: string[];

  constructor(role?: LearningObjectRole, tags?: string[]) {
    this.role = role;
    this.tags = tags;
  }


  abstract getComponent(): Type<LearningObjectComponent>;

}
