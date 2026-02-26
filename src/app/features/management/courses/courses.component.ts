import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericTableComponent } from '../../../shared/generics/generic-table/generic-table.component';
import { CrudService } from '../../../shared/generics/generic-table/crud.service';
import { ManagementCrudService } from '../management-crud.service';
import { Field } from '../../../shared/generics/model/field.model';
import { Entity } from '../../../shared/generics/model/entity.model';
import { PagedResults } from '../../../shared/model/paged-results.model';
import { Course } from '../../../shared/model/course.model';
import { Group } from '../model/group.model';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { OwnersComponent } from './owners/owners.component';
import { EnrolledLearnersComponent } from './enrolled-learners/enrolled-learners.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cc-courses',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CrudService, useClass: ManagementCrudService }],
  imports: [GenericTableComponent, OwnersComponent, EnrolledLearnersComponent],
  templateUrl: './courses.component.html',
})
export class CoursesComponent {
  private readonly http = inject(HttpClient);

  readonly baseUrl = environment.apiHost + 'management/courses/';
  readonly fields: Field[] = [
    { code: 'code', type: 'string', label: 'Kod', required: true },
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'startDate', type: 'date', label: 'Dan početka', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: { create: true, clone: true, update: true, archive: true, secureDelete: true, filter: true } },
  ];

  readonly groupFields: Field[] = [
    { code: 'name', type: 'string', label: 'Naziv', required: true },
    { code: 'CRUD', type: 'CRUD', label: '', crud: { create: true, update: true, delete: true } },
  ];

  readonly selectedCourse = signal<Course | null>(null);
  readonly selectedGroup = signal<Group | null>(null);
  readonly baseGroupUrl = signal('');
  readonly allInstructors = signal<StakeholderAccount[]>([]);

  constructor() {
    this.http.get<PagedResults<StakeholderAccount>>(environment.apiHost + 'management/instructors/')
      .subscribe(response => this.allInstructors.set(response.results));
  }

  onSelect(entity: Entity): void {
    const course = entity as Entity & Course;
    this.selectedCourse.set(course);
    this.selectedGroup.set(null);
    this.baseGroupUrl.set(this.baseUrl + course.id + '/groups/');
  }

  onSelectGroup(entity: Entity): void {
    this.selectedGroup.set(entity as Group);
  }
}
