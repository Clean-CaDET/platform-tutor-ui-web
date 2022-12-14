import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from 'src/app/modules/learning/course/course.model';
import { LayoutInstructorService } from '../../layout-instructor.service';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: User = null;
  courses: Course[] = [];

  constructor(
    private authService: AuthenticationService,
    private layoutService: LayoutService,
    private layoutInstructorService: LayoutInstructorService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (this.user === null) {
        this.courses = [];
        return;
      }
      if (this.user.role == 'learner') {
        this.layoutService.getCourses().subscribe((courses) => {
          this.courses = courses;
        });
      } else if (this.user.role == 'instructor') {
        this.layoutInstructorService.getCourses().subscribe((courses) => {
          this.courses = courses;
        });
      }
    });
  }
}
