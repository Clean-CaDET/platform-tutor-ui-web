import {LearningEvent} from "../../knowledge-analytics/model/learning-event.model";


export class Session {
  id: number;
  start: Date;
  end: Date;
  events: LearningEvent[];

  constructor(obj?: any) {
    this.start = new Date(obj.start);
    this.end = new Date(obj.end);
    this.events = obj.events.map((le: any) => new LearningEvent(le));
  }
}
