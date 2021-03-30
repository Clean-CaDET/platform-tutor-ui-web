import { LearningObject } from '../../model/learning-object.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { Type } from '@angular/core';
import { ArrangeTaskComponent } from '../arrange-task.component';

export class ArrangeTask extends LearningObject {

  elements: any[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.elements = obj.elements;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ArrangeTaskComponent;
  }
}
