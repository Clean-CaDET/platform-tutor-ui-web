import { Component, ChangeDetectionStrategy, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/auth/model/user.model';
import { Course } from '../../../shared/model/course.model';
import { LayoutService } from '../../../core/layout/layout.service';
import { CourseCardComponent } from './course-card/course-card.component';

@Component({
  selector: 'cc-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CourseCardComponent, RouterLink, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);

  readonly user = input.required<User>();
  readonly courses = signal<Course[]>([]);

  ngOnInit(): void {
    const sortByDate = (a: Course, b: Course) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

    const u = this.user();
    if (u.role.includes('learner')) {
      this.layoutService.getLearnerCourses().subscribe((page) => {
        this.courses.set(page.results.sort(sortByDate));
      });
    } else if (u.role === 'instructor') {
      this.layoutService.getInstructorCourses().subscribe((courses) => {
        this.courses.set(courses.sort(sortByDate));
      });
    }
  }
}
