import { Type } from '@angular/core';
import { Container } from 'src/app/modules/learning/model/learning-objects/arrange-task/container.model';
import { Element } from 'src/app/modules/learning/model/learning-objects/arrange-task/element.model';
import { LearningObjectComponent } from '../../learning-object-component';
import { LearningObject } from '../../learning-object.model';
import { ArrangeTaskComponent } from './arrange-task.component';

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
