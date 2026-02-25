import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { Course } from '../../../shared/model/course.model';
import { Unit } from '../../../shared/model/unit.model';
import { CourseStructureService } from './course-structure.service';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { UnitDetailsComponent } from './unit-details/unit-details.component';
import { KcTreeComponent } from '../knowledge-component/kc-tree/kc-tree.component';
import { getRouteParams, onNavigationEnd } from '../../../core/route.util';

enum DisplayType {
  Details = 1,
  Kcs,
  Tasks,
  Reflections,
}

@Component({
  selector: 'cc-course-structure',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    ScrollingModule, CourseDetailsComponent, UnitDetailsComponent, KcTreeComponent,
  ],
  templateUrl: './course-structure.component.html',
  styleUrl: './course-structure.component.scss',
})
export class CourseStructureComponent {
  private readonly courseService = inject(CourseStructureService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  course = signal<Course | null>(null);
  selectedUnit = signal<Unit | null>(null);
  display = signal<DisplayType>(DisplayType.Details);

  readonly DisplayType = DisplayType;

  constructor() {
    const params = getRouteParams(this.route);
    this.loadCourse(+params['courseId']);

    onNavigationEnd((_url, p) => {
      const id = +p['courseId'];
      if (id) this.loadCourse(id);
    });
  }

  private loadCourse(courseId: number): void {
    this.courseService.getCourse(courseId).subscribe(course => {
      course.knowledgeUnits = (course.knowledgeUnits ?? []).sort((u1, u2) => u1.order - u2.order);
      this.course.set(course);

      const unitId = this.route.snapshot.queryParams['unit'];
      if (unitId) {
        const unit = course.knowledgeUnits!.find(u => u.id == unitId);
        if (!unit) return;
        const mode = this.route.snapshot.queryParams['mode'];
        if (mode === 'kc') { this.showKcs(unit); return; }
        if (mode === 'lt') { this.showTasks(unit); return; }
        if (mode === 'ref') { this.showReflections(unit); return; }
        this.showDetails(unit);
      }
    });
  }

  updateCourse(newCourse: Course): void {
    this.courseService.updateCourse(newCourse).subscribe(updatedCourse => {
      updatedCourse.knowledgeUnits = this.course()!.knowledgeUnits;
      this.course.set(updatedCourse);
    });
  }

  createUnit(): void {
    this.selectedUnit.set({ code: '', name: '', goals: '', order: this.getMaxOrder() + 10 });
    this.display.set(DisplayType.Details);
  }

  private getMaxOrder(): number {
    const units = this.course()?.knowledgeUnits;
    if (!units?.length) return 0;
    return Math.max(...units.map(u => u.order));
  }

  showDetails(unit: Unit): void {
    this.selectedUnit.set(unit);
    this.display.set(DisplayType.Details);
    this.router.navigate([], { queryParams: { unit: unit.id, mode: '' }, queryParamsHandling: 'merge' });
  }

  showKcs(unit: Unit): void {
    this.selectedUnit.set(unit);
    this.display.set(DisplayType.Kcs);
    this.router.navigate([], { queryParams: { unit: unit.id, mode: 'kc' }, queryParamsHandling: 'merge' });
  }

  showTasks(unit: Unit): void {
    this.selectedUnit.set(unit);
    this.display.set(DisplayType.Tasks);
    this.router.navigate([], { queryParams: { unit: unit.id, mode: 'lt' }, queryParamsHandling: 'merge' });
  }

  showReflections(unit: Unit): void {
    this.selectedUnit.set(unit);
    this.display.set(DisplayType.Reflections);
    this.router.navigate([], { queryParams: { unit: unit.id, mode: 'ref' }, queryParamsHandling: 'merge' });
  }

  saveOrUpdateUnit(unit: Unit): void {
    const course = this.course()!;
    if (!unit.id) {
      this.courseService.saveUnit(course.id!, unit).subscribe(newUnit => {
        newUnit.knowledgeComponents = [];
        const units = [...course.knowledgeUnits!, newUnit].sort((u1, u2) => u1.order - u2.order);
        this.course.set({ ...course, knowledgeUnits: units });
        this.selectedUnit.set(newUnit);
        setTimeout(() => {
          document.querySelector('#u' + newUnit.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    } else {
      this.courseService.updateUnit(course.id!, unit).subscribe(updatedUnit => {
        const units = course.knowledgeUnits!.map(u =>
          u.id === updatedUnit.id
            ? { ...u, code: updatedUnit.code, name: updatedUnit.name, introduction: updatedUnit.introduction, goals: updatedUnit.goals, guidelines: updatedUnit.guidelines, order: updatedUnit.order }
            : u
        ).sort((u1, u2) => u1.order - u2.order);
        this.course.set({ ...course, knowledgeUnits: units });
      });
    }
  }

  onUnitKcsChanged(updatedUnit: Unit): void {
    const course = this.course()!;
    const units = course.knowledgeUnits!.map(u =>
      u.id === updatedUnit.id ? updatedUnit : u
    );
    this.course.set({ ...course, knowledgeUnits: units });
    this.selectedUnit.set(updatedUnit);
  }

  deleteUnit(unitId: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);
    diagRef.afterClosed().subscribe(result => {
      if (!result) return;
      const course = this.course()!;
      this.courseService.deleteUnit(course.id!, unitId).subscribe(() => {
        const units = course.knowledgeUnits!.filter(u => u.id !== unitId);
        this.course.set({ ...course, knowledgeUnits: units });
        this.selectedUnit.set(null);
      });
    });
  }
}
