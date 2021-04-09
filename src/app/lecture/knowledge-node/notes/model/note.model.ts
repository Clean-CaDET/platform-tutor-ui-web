export class Note {
  id: number;
  text: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.text = obj.text;
    }
  }
}
