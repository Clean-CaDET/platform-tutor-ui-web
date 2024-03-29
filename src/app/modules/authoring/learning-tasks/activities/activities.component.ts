import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from 'src/app/modules/learning/model/course.model';
import { Activity } from '../model/activity';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent {

  constructor() { }

  course: Course;
  @Input() activities: Activity[];
  selectedActivity: Activity;
  parentActivity: Activity;

  @Output() activitySaved = new EventEmitter<Activity>();
  @Output() activityDeleted = new EventEmitter<number>();

  select(activity: Activity) {
    this.selectedActivity = activity;
  }

  save(activity: Activity) {
    this.activitySaved.emit(activity);
  }

  update(activity: Activity) {
    this.activitySaved.emit(activity);
  }

  delete(activityId: number): void {
    const activity = this.activities.find(a => a.id === activityId);
    const parentActivity = this.activities.find(a => a.id === activity.parentId);
    const index = parentActivity.subactivities.findIndex(subactivity => subactivity.id === activityId);
    parentActivity.subactivities.splice(index, 1);
    
    parentActivity.subactivities.forEach((subactivity: Activity, idx: number) => {
      subactivity.order = idx + 1;
    });
    this.selectedActivity = null;
    this.activityDeleted.emit(activityId);
  }

  addSubactivity(activity: Activity) {
    this.parentActivity = activity;
  }
}