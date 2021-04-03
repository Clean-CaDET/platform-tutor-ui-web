import { Element } from './element.model';

export class Container {
  id: number;
  title: string;
  elements: Element[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.title = obj.title;
    }
  }
}
