import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { Course } from '../../../../shared/model/course.model';
import { User } from '../../../../core/auth/model/user.model';

@Component({
  selector: 'cc-course-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MarkdownComponent],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  private readonly router = inject(Router);

  readonly course = input.required<Course>();
  readonly user = input.required<User>();

  onCourseClick(): void {
    if (this.user().role.includes('learner')) {
      this.router.navigate(['/courses/' + this.course().id]);
    }
  }
}
