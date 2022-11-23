import { Component, OnInit } from '@angular/core';
import { Course } from '../../learning/course/course.model';
import { User } from '../../../infrastructure/auth/user.model';
import { AuthenticationService } from '../../../infrastructure/auth/auth.service';
import { InstructorService } from '../../group-monitoring/instructor/instructor.service';
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
    private instructorService: InstructorService
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
        this.instructorService.getCourses().subscribe((courses) => {
          this.courses = courses;
        });
      }
    });
  }
}
