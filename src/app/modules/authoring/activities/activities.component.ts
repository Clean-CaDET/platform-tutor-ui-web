import { Component, OnInit } from '@angular/core';
import { Course } from '../../learning/model/course.model';
import { CourseStructureService } from '../course-structure/course-structure.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  course: Course;
  activities: any[];
  selectedActivity: any;

  ngOnInit() {
    this.setCourse();
    this.setActivities();
  }

  setCourse() {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe(course => {
        this.course = course;
      });
    });
  }

  setActivities() {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourseActivities(+params.courseId).subscribe(activities => {
        this.mapSubactivities(activities);
        let activityId = this.route.snapshot.queryParams['activityId'];
        if (activityId) {
          this.selectedActivity = this.activities.find(u => u.id == activityId);
        }
      });
    });
  }

  mapSubactivities(activities: any[]) {
    this.activities = activities.sort((a1, a2) => a1.code - a2.code);
    for (let activity of activities) {
      activity.subactivities = activities
        .filter((a) => activity.subactivities.some((sa: { childId: any; }) => sa.childId === a.id))
        .map((subactivity) => {
          const matchingSubactivity = activity.subactivities.find((sa: { childId: any; }) => sa.childId === subactivity.id);
          return {
            order: matchingSubactivity?.order,
            childId: matchingSubactivity?.childId,
            ...subactivity,
          };
        })
        .sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
    }
    this.activities = [...this.activities.sort((a1, a2) => a1.code.localeCompare(a2.code))];
  }

  select(activity: any) {
    this.selectedActivity = activity;
    this.router.navigate([], {
      queryParams: { activityId: activity.id },
      queryParamsHandling: 'merge'
    });
  }

  createActivity() {
    this.selectedActivity = {
      code: '',
      name: '',
      isExpanded: true,
      guidance: {
        description: ''
      },
      examples: [],
      standards: [],
      subactivities: []
    }
  }

  save(activity: any) {
    if (this.selectedActivity.id) {
      activity.id = this.selectedActivity.id;
      activity.subactivities = this.selectedActivity.subactivities;
      this.update(activity);
    } else {
      this.create(activity);
    }
  }

  create(activity: any) {
    this.courseService.saveActivity(this.course.id, activity).subscribe(newActivity => {
      this.activities = [...this.activities, newActivity];
      this.selectedActivity = newActivity;
      this.mapSubactivities(this.activities);
    });
  }

  update(activity: any) {
    this.courseService.updateActivity(this.course.id, activity).subscribe(updatedActivity => {
      let activity = this.activities.find(u => u.id === updatedActivity.id);
      activity.code = updatedActivity.code;
      activity.name = updatedActivity.name;
      activity.guidance.description = updatedActivity.guidance.description;
      activity.examples = updatedActivity.examples;
      activity.standards = updatedActivity.standards;
      activity.subactivities = updatedActivity.subactivities;
      this.mapSubactivities(this.activities);
    });
  }

  delete(activityId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteActivity(this.course.id, activityId).subscribe(() => {
          this.activities = [...this.activities.filter(a => a.id !== activityId)];
          this.selectedActivity = null;
        });
      }
    });
  }

  confirmStep() {

  }

  cancelStep() {
    
  }
}