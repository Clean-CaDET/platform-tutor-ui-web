export class Container {
  title: string;
  elements: string[];

  constructor(obj?: any) {
    if (obj) {
      this.title = obj.title;
      this.elements = obj.elements;
    }
  }
}
