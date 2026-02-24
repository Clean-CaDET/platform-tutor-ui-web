import { Component, ChangeDetectionStrategy, inject, input, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { switchMap, of, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { Course } from '../../../../shared/model/course.model';
import { Unit } from '../../../../shared/model/unit.model';
import { CourseService } from '../course.service';

interface EnrichedUnit extends Unit {
  isCompleted: boolean;
  isOverdue: boolean;
}

@Component({
  selector: 'cc-course-units',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MarkdownComponent],
  templateUrl: './course-units.component.html',
  styleUrl: './course-units.component.scss',
})
export class CourseUnitsComponent {
  private readonly courseService = inject(CourseService);

  readonly course = input.required<Course>();
  readonly completedUnitIds = signal<Set<number>>(new Set());

  readonly units = computed<EnrichedUnit[]>(() => {
    const course = this.course();
    const completedIds = this.completedUnitIds();
    const now = new Date();
    return (course.knowledgeUnits ?? []).map(unit => {
      const isCompleted = unit.enrollmentStatus === 'Completed' || completedIds.has(unit.id!);
      return {
        ...unit,
        isCompleted,
        isOverdue: !!unit.bestBefore && unit.bestBefore < now && !isCompleted,
      };
    });
  });

  constructor() {
    toObservable(this.course).pipe(
      filter(c => !!c?.knowledgeUnits?.length),
      switchMap(course => {
        const unitIds = course.knowledgeUnits!
          .filter(u => u.enrollmentStatus !== 'Completed')
          .map(u => u.id!)
          .filter(id => id != null);
        return unitIds.length && course.id
          ? this.courseService.getMasteredUnitIds(course.id, unitIds)
          : of([]);
      }),
      takeUntilDestroyed(),
    ).subscribe(masteredIds => {
      this.completedUnitIds.set(new Set(masteredIds));
    });
  }
}
