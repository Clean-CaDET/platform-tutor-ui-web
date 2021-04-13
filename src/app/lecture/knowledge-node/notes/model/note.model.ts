export class Note {
  id: number;
  text: string;
  mode = 'preview';

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.text = obj.text;
    }
  }
}
