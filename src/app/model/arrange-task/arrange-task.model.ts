import { LearningObject } from '../learning-object/learning-object.model';
import { LearningObjectComponent } from '../../modules/content/learning-objects/learning-object-component';
import { Type } from '@angular/core';
import { ArrangeTaskComponent } from '../../modules/content/learning-objects/arrange-task/arrange-task.component';
import { Container } from './container.model';
import { Element } from './element.model';

export class ArrangeTask extends LearningObject {

  text: string;
  containers: Container[];
  unarrangedElements: Element[];

  constructor(obj?: any) {
    if (obj) {
      super(obj);
      this.text = obj.text;
      this.containers = obj.containers;
      this.unarrangedElements = obj.unarrangedElements;
    }
  }

  getComponent(): Type<LearningObjectComponent> {
    return ArrangeTaskComponent;
  }
}
