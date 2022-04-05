export class Learner {
  id: number;
  studentIndex: string;
  name: string;
  surname: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.studentIndex = obj.studentIndex;
      this.name = obj.name;
      this.surname = obj.surname;
    }
  }
}
