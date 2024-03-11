import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Course } from '../../learning/model/course.model';
import { Router } from '@angular/router';
import { Activity } from '../learning-tasks/model/activity';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnChanges {

  constructor(private router: Router) { }

  course: Course;
  @Input() activities: any[];
  selectedActivity: any;
  parentActivity: any;

  @Output() activitySaved = new EventEmitter<Activity>();
  @Output() activityDeleted = new EventEmitter<number>();

  ngOnChanges() {
    this.mapSubactivities(this.activities);
  }

  mapSubactivities(activities: any[]) {
    for (const activity of activities) {
      activity.subactivities = [];
      
      for (const subactivity of activities) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
    }
  }

  select(activity: Activity) {
    this.selectedActivity = activity;
    this.router.navigate([], {
      queryParams: { activityId: activity.id },
      queryParamsHandling: 'merge'
    });
  }

  save(activity: Activity) {
    this.activities = [...this.activities, activity];
    this.activitySaved.emit(activity);
  }

  update(activity: any) {
    this.activitySaved.emit(activity);
  }

  delete(activityId: number): void {
    const activity = this.activities.find(a => a.id === activityId);
    const parentActivity = this.activities.find(a => a.id === activity.parentId);
    const index = parentActivity.subactivities.findIndex((subactivity: { id: number; }) => subactivity.id === activityId);
    parentActivity.subactivities.splice(index, 1);
    
    parentActivity.subactivities.forEach((subactivity: { order: any; }, idx: number) => {
      subactivity.order = idx + 1;
    });
    this.selectedActivity = null;
    this.activityDeleted.emit(activityId);
  }

  addSubactivity(activity: any) {
    this.parentActivity = activity;
  }
}