export class Trainee {
  index: string;

  constructor(obj?: any) {
    if (obj) {
      this.index = obj.index;
    }
  }
}
