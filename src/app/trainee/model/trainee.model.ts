export class Trainee {
  studentIndex: string;

  constructor(obj?: any) {
    if (obj) {
      this.studentIndex = obj.studentIndex;
    }
  }
}
