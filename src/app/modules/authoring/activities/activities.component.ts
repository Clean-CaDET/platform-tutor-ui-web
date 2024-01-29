import { Component, OnInit } from '@angular/core';
import { Course } from '../../learning/model/course.model';
import { CourseStructureService } from '../course-structure/course-structure.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute, private dialog: MatDialog) { }

  course: Course;

  activities: any[];

  selectedActivity: any;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe(course => {
        this.course = course;
      });
    });

    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourseActivities(+params.courseId).subscribe(activities => {
        this.activities = [...activities.sort((a1, a2) => a1.code.localeCompare(a2.code))];
        this.mapSubactivities(activities);
      });
    });
  }

  mapSubactivities(activities: any[]) {
    this.activities = activities.sort((a1, a2) => a1.id - a2.id);
    for (const activity of activities) {
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
  }

  select(activity: any) {
    this.selectedActivity = activity;
  }

  save(activity: any) {
    if (this.selectedActivity.id) {
      activity.id = this.selectedActivity.id;
      activity.subactivities = this.selectedActivity.subactivities;
      this.courseService.updateActivity(this.course.id, activity).subscribe(updatedActivity => {
        let activity = this.activities.find(u => u.id === updatedActivity.id);
        activity.code = updatedActivity.code;
        activity.name = updatedActivity.name;
        activity.guidance.description = updatedActivity.guidance.description;
        activity.examples = updatedActivity.examples;
        activity.subactivities = updatedActivity.subactivities;
        this.activities = [...this.activities.sort((a1, a2) => a1.code.localeCompare(a2.code))];
        this.mapSubactivities(this.activities);
      });
    } else {
      this.courseService.saveActivity(this.course.id, activity).subscribe(newActivity => {
        this.activities.push(newActivity);
        this.selectedActivity = newActivity;
        this.activities = [...this.activities.sort((a1, a2) => a1.code.localeCompare(a2.code))];
        this.mapSubactivities(this.activities);
      });
    }
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

  update(activity: any) {
    this.courseService.updateActivity(this.course.id, activity).subscribe(updatedActivity => {
      let activity = this.activities.find(u => u.id === updatedActivity.id);
      activity.code = updatedActivity.code;
      activity.name = updatedActivity.name;
      activity.guidance.description = updatedActivity.guidance.description;
      activity.examples = updatedActivity.examples;
      activity.subactivities = updatedActivity.subactivities;
      this.activities = [...this.activities.sort((a1, a2) => a1.code.localeCompare(a2.code))];
      this.mapSubactivities(this.activities);
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
      subactivities: [],
      examples: []
    }
  }
}