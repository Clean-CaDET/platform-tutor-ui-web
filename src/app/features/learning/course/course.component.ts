import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MarkdownComponent } from 'ngx-markdown';
import { Course } from '../../../shared/model/course.model';
import { CourseService } from './course.service';
import { CourseUnitsComponent } from './course-units/course-units.component';
import { onNavigationEnd } from '../../../core/route.util';

@Component({
  selector: 'cc-course',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownComponent, CourseUnitsComponent],
  template: `
    @if (course(); as course) {
      <div class="container">
        <h1>{{ course.name }}</h1>
        <markdown [data]="course.description" />
        <cc-course-units [course]="course" />
      </div>
    }
  `,
  styles: `
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 { text-align: left; }
  `,
})
export class CourseComponent {
  private readonly courseService = inject(CourseService);
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private loadedCourseId = 0;

  readonly course = signal<Course | null>(null);

  constructor() {
    this.loadCourse(+this.route.snapshot.params['courseId']);

    onNavigationEnd((_url, params) => {
      const id = +params['courseId'];
      if (id) this.loadCourse(id);
    });
  }

  private loadCourse(courseId: number): void {
    if (!courseId || courseId === this.loadedCourseId) return;
    this.loadedCourseId = courseId;
    this.courseService.getCourse(courseId).subscribe(course => {
      this.course.set(course);
      this.title.setTitle(`${course.name} - Tutor`);
    });
  }
}
