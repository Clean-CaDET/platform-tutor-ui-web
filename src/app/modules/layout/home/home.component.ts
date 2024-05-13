import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from 'src/app/modules/learning/model/course.model';
import { LayoutService } from '../layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  user: User = null;
  courses: Course[] = [];

  constructor(private authService: AuthenticationService, private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
      if (!this.user) {
        this.courses = [];
        return;
      }
      if (this.user.role.includes('learner')) {
        this.layoutService.getLearnerCourses().subscribe((coursesPage) => {
          this.courses = coursesPage.results;
        });
      } else if (this.user.role === 'instructor') {
        this.layoutService.getInstructorCourses().subscribe((courses) => {
          this.courses = courses;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
