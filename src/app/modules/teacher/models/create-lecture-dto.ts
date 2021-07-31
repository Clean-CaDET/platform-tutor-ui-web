import {LectureModel} from './lecture-model';

export class CreateLectureDto {
  lecture: LectureModel;
  teacherId: number;

  constructor(obj?: any) {
    if (obj){
      this.lecture = obj.lecture;
      this.teacherId = obj.teacherId;
    }
  }
}
