import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Course } from '../model/course.model';
import { AuthenticationService } from '../../../infrastructure/auth/auth.service';
import { User } from '../../../infrastructure/auth/user.model';
import { CourseService } from './course.service';

@Component({
  selector: 'cc-course-component',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  course: Course;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.authService.user$.subscribe((user) => {
        this.user = user;
      });
      this.courseService
        .getCourse(+params.courseId)
        .subscribe((course) => (this.course = course));
    });
  }
}
