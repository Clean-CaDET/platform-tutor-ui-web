import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from '../../learning/course/course.model';
import { LayoutInstructorService } from '../layout-instructor.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  courses: Course[];
  user: User;

  constructor(
    private authService: AuthenticationService,
    private layoutService: LayoutService,
    private layoutInstructorService: LayoutInstructorService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user == null) return;
      this.user = user;
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
