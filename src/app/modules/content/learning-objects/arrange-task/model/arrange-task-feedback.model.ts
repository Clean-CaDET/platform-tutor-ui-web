import {Element} from './element.model';

export class ArrangeTaskFeedback {
  id: number;
  submissionWasCorrect: boolean;
  correctElements: Element[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.submissionWasCorrect = obj.submissionWasCorrect;
      this.correctElements = obj.correctElements.map(correctElement => new Element(correctElement));
    }
  }
}
