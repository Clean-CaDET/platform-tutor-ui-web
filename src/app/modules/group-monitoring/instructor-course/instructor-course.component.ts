import { Component, OnInit } from '@angular/core';
import { Course } from '../../learning/course/course.model';
import { ActivatedRoute, Params } from '@angular/router';
import { GroupMonitoringService } from '../group-monitoring.service';

@Component({
  selector: 'cc-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrls: ['./instructor-course.component.scss'],
})
export class InstructorCourseComponent implements OnInit {
  course: Course = new Course();

  constructor(
    private route: ActivatedRoute,
    private groupMonitoringService: GroupMonitoringService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.groupMonitoringService
        .getCourse(+params.courseId)
        .subscribe((course) => (this.course = course));
    });
  }
}
