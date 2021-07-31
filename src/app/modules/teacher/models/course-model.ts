export class CourseModel {
  id: number;
  lectures: [];
  name: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.lectures = obj.lectures;
      this.name = obj.name;
    }
  }
}
