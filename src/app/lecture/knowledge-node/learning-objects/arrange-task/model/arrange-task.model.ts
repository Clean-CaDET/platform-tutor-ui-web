import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { ArrangeTaskComponent } from '../arrange-task.component';
import { Container } from './container.model';

export class ArrangeTask extends LearningObject {

  text: string;
  containers: Container[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.containers = obj.containers;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ArrangeTaskComponent;
  }
}
