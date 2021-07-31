import {TimeStampFromCSharp} from './time-stamp-from-csharp';

export class IndividualPlanModel {
  id: number;
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfLectures: number;
  duration: TimeStampFromCSharp;

  constructor(obj?: any) {
    if (obj){
      this.id = obj.id;
      this.numberOfUsers = obj.numberOfUsers;
      this.numberOfCourses = obj.numberOfCourses;
      this.numberOfLectures = obj.numberOfLectures;
      this.duration = obj.duration;
    }
  }
}
