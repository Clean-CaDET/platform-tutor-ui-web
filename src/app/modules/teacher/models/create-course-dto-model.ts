import {CourseModel} from './course-model';

export class CreateCourseDtoModel {
  course: CourseModel;
  teacherId: number;

  constructor(obj?: any) {
    if (obj) {
      this.course = obj.course;
      this.teacherId = obj.teacherId;
    }
  }
}
