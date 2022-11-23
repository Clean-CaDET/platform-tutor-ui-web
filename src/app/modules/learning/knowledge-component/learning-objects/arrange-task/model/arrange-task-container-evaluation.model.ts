import {Element} from './element.model';

export class ArrangeTaskContainerEvaluation {
  id: number;
  correctElements: Element[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.correctElements = obj.correctElements.map(correctElement => new Element(correctElement));
    }
  }
}
