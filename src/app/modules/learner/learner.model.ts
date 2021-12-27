export class Learner {
  id: number;
  studentIndex: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.studentIndex = obj.studentIndex;
    }
  }
}
