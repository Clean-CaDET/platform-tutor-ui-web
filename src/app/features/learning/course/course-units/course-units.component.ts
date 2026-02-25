import { Component, ChangeDetectionStrategy, inject, input, signal, computed, effect } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { switchMap, of, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { NoteManagerComponent } from '../../notes/note-manager.component';
import { Course } from '../../model/course.model';
import { Unit } from '../../model/unit.model';
import { CourseService } from '../course.service';
import { MatDividerModule } from '@angular/material/divider';

interface EnrichedUnit extends Unit {
  isCompleted: boolean;
  isOverdue: boolean;
}

@Component({
  selector: 'cc-course-units',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DatePipe, MatDividerModule, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, CcMarkdownComponent, NoteManagerComponent],
  templateUrl: './course-units.component.html',
  styleUrl: './course-units.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('out', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      transition('void => out', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      transition('void => in', [
        style({ height: '0', opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 })),
      ]),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out')),
    ]),
  ],
})
export class CourseUnitsComponent {
  private readonly courseService = inject(CourseService);

  readonly course = input.required<Course>();
  readonly completedUnitIds = signal<Set<number>>(new Set());
  readonly notesVisible = signal<boolean[]>([]);
  readonly notesLoaded = signal<boolean[]>([]);

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
    effect(() => {
      const count = this.units().length;
      this.notesVisible.set(new Array(count).fill(false));
      this.notesLoaded.set(new Array(count).fill(false));
    });

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

  toggleNotes(index: number): void {
    if (!this.notesLoaded()[index]) {
      this.notesLoaded.update(arr => arr.map((v, i) => i === index ? true : v));
      this.notesVisible.update(arr => arr.map((v, i) => i === index ? true : v));
    } else {
      this.notesVisible.update(arr => arr.map((v, i) => i === index ? !v : v));
    }
  }
}
