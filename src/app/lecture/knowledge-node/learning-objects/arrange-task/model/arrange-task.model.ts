import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { ArrangeTaskComponent } from '../arrange-task.component';
import { Container } from './container.model';

export class ArrangeTask extends LearningObject {

  containers: Container[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.containers = obj.containers;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ArrangeTaskComponent;
  }
}
