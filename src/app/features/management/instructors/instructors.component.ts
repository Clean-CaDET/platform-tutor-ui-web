import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericTableComponent } from '../../../shared/generics/generic-table/generic-table.component';
import { CrudService } from '../../../shared/generics/generic-table/crud.service';
import { ManagementCrudService } from '../management-crud.service';
import { Field } from '../../../shared/generics/model/field.model';
import { Entity } from '../../../shared/generics/model/entity.model';
import { PagedResults } from '../../../shared/model/paged-results.model';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { Course } from '../../../shared/model/course.model';
import { OwnedCoursesComponent } from './owned-courses/owned-courses.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cc-instructors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CrudService, useClass: ManagementCrudService }],
  imports: [GenericTableComponent, OwnedCoursesComponent],
  template: `
    <div class="flex-row gap" style="width: 98%; height: 100%;">
      <cc-generic-table style="flex-grow: 1;"
        [title]="'Mentori'"
        [fieldConfiguration]="instructorFields"
        [baseUrl]="baseUrl"
        (selectItem)="onSelect($event)" />
      <div style="width: 350px; height: 100%;">
        @if (selectedInstructor()) {
          <cc-owned-courses [instructor]="selectedInstructor()!" [allCourses]="allCourses()" />
        }
      </div>
    </div>
  `,
})
export class InstructorsComponent {
  private readonly http = inject(HttpClient);

  readonly baseUrl = environment.apiHost + 'management/instructors/';
  readonly instructorFields: Field[] = [
    { code: 'email', type: 'email', label: 'Email / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: { create: true, update: true, archive: true, delete: true, filter: true } },
  ];

  readonly selectedInstructor = signal<StakeholderAccount | null>(null);
  readonly allCourses = signal<Course[]>([]);

  constructor() {
    this.http.get<PagedResults<Course>>(environment.apiHost + 'management/courses/')
      .subscribe(response => this.allCourses.set(response.results));
  }

  onSelect(entity: Entity): void {
    if (!entity) return;
    this.selectedInstructor.set(entity as StakeholderAccount);
  }
}
