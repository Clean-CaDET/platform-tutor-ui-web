export class Note {
  id: number;
  text: string;
  unitId: number;
  mode = 'preview';

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.text = obj.text;
      this.unitId = obj.unitId;
    }
  }
}
