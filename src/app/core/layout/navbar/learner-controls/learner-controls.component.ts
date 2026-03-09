import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutService } from '../../layout.service';
import { Course } from '../../../../shared/model/course.model';
import { getRouteParams, onNavigationEnd } from '../../../route.util';

@Component({
  selector: 'cc-learner-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  templateUrl: './learner-controls.component.html',
  styleUrl: './learner-controls.component.scss',
})
export class LearnerControlsComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly route = inject(ActivatedRoute);

  readonly courses = signal<Course[]>([]);
  readonly selectedCourse = signal<Course | null>(null);

  constructor() {
    this.layoutService.getLearnerCourses().subscribe((page) => {
      this.courses.set(page.results);
      const params = getRouteParams(this.route);
      if (params['courseId']) {
        this.selectCourse(+params['courseId']);
      }
    });

    onNavigationEnd((_url, params) => {
      if (!params['courseId']) {
        this.selectedCourse.set(null);
        return;
      }
      if (this.selectedCourse()?.id !== +params['courseId']) {
        this.selectCourse(+params['courseId']);
      }
    });
  }

  private selectCourse(courseId: number): void {
    this.selectedCourse.set(this.courses().find((c) => c.id === courseId) ?? null);
  }
}
