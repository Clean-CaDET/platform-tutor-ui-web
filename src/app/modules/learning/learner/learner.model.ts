export class Learner {
  id: number;
  index: string;
  name: string;
  surname: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.index = obj.index;
      this.name = obj.name;
      this.surname = obj.surname;
    }
  }
}
