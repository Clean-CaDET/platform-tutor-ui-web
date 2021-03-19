import { Type } from '@angular/core';
import { LearningObjectRole } from '../enum/learning-object-role.enum';
import { LearningObjectComponent } from '../learning-object-component';

export abstract class LearningObject {
  id: number;
  role: LearningObjectRole;
  tags: string[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.role = obj.role;
      this.tags = obj.tags;
    }
  }

  abstract getComponent(): Type<LearningObjectComponent>;

}
