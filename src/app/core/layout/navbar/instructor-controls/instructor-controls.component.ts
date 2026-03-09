import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutService } from '../../layout.service';
import { Course } from '../../../../shared/model/course.model';
import { getRouteParams, onNavigationEnd } from '../../../route.util';

@Component({
  selector: 'cc-instructor-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  templateUrl: './instructor-controls.component.html',
  styleUrl: './instructor-controls.component.scss',
})
export class InstructorControlsComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly courses = signal<Course[]>([]);
  readonly selectedCourse = signal<Course | null>(null);
  readonly selectedControl = signal('monitoring');
  readonly selectedSubcontrol = signal('progress');

  constructor() {
    this.deriveSelectedControls(this.router.url);
    this.layoutService.getInstructorCourses().subscribe((courses) => {
      this.courses.set(courses);
      const params = getRouteParams(this.route);
      if (params['courseId']) {
        this.selectCourse(+params['courseId']);
      }
    });

    onNavigationEnd((url, params) => {
      this.deriveSelectedControls(url);
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

  private deriveSelectedControls(url: string): void {
    if (url.includes('monitoring')) {
      this.selectedControl.set('monitoring');
      if (url.includes('enrollments')) this.selectedSubcontrol.set('enrollments');
      else if (url.includes('grading')) this.selectedSubcontrol.set('grading');
      else this.selectedSubcontrol.set('progress');
    } else if (url.includes('authoring')) {
      this.selectedControl.set('authoring');
      this.selectedSubcontrol.set('units');
    } else if (url.includes('analytics')) {
      this.selectedControl.set('analytics');
      this.selectedSubcontrol.set('statistics');
    } else {
      this.selectedControl.set('monitoring');
      this.selectedSubcontrol.set('progress');
    }
  }
}
