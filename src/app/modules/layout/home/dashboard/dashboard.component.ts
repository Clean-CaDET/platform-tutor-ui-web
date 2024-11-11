import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from 'src/app/modules/learning/model/course.model';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnChanges {
  @Input() user: User;
  courses: Course[];

  constructor(private layoutService: LayoutService) {}

  ngOnChanges(): void {
    if (!this.user) {
      this.courses = [];
      return;
    }
    if (this.user.role.includes('learner')) {
      this.layoutService.getLearnerCourses().subscribe((coursesPage) => {
        this.courses = coursesPage.results.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      });
    } else if (this.user.role === 'instructor') {
      this.layoutService.getInstructorCourses().subscribe((courses) => {
        this.courses = courses.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      });
    }
  }
}
