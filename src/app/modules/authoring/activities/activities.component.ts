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
        this.activities = activities.sort((a1, a2) => a1.id - a2.id);
      });
    });
  }

  updateCourse(newCourse: Course): void {
    this.courseService.updateCourse(newCourse).subscribe(updatedCourse => {
      updatedCourse.knowledgeUnits = this.course.knowledgeUnits;
      this.course = updatedCourse;
    });
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
        this.activities = [...this.activities.sort((a1, a2) => a1.id - a2.id)];
      });
    } else {
      this.courseService.saveActivity(this.course.id, activity).subscribe(newActivity => {
        this.activities.push(newActivity);
        this.selectedActivity = newActivity;
        this.activities = [...this.activities.sort((a1, a2) => a1.id - a2.id)];
      });
    }
  }

  delete(activityId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.courseService.deleteActivity(this.course.id, activityId).subscribe(() => {
        this.activities = [...this.activities.filter(a => a.id !== activityId)];
        this.selectedActivity = null;
      });
    });
  }

  createActivity() {
    this.selectedActivity = {
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
