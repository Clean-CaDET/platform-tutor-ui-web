import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from '../../../../learning/model/course.model';

@Component({
  selector: 'cc-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent {
  @Input() course: Course;
  @Input() user: User;

  constructor(private router: Router) {}

  onCourseClick(): void {
    if (this.user.role.includes('learner'))
      this.router.navigate(['/courses/' + this.course.id]);
  }
}
