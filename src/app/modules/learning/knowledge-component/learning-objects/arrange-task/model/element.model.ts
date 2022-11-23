export class Element {
  id: number;
  text: string;
  feedback: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.text = obj.text;
      this.feedback = obj.feedback;
    }
  }
}
