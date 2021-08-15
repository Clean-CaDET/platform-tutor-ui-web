export class IndividualPlanModel {
  id: number;
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfLectures: number;
  duration: any;
  days: number;

  constructor(obj?: any) {
    if (obj){
      this.id = obj.id;
      this.numberOfUsers = obj.numberOfUsers;
      this.numberOfCourses = obj.numberOfCourses;
      this.numberOfLectures = obj.numberOfLectures;
      this.duration = obj.duration;
      this.days = obj.days;
    }
  }
}
