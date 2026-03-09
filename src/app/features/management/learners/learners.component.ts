import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { GenericTableComponent } from '../../../shared/generics/generic-table/generic-table.component';
import { CrudService } from '../../../shared/generics/generic-table/crud.service';
import { ManagementCrudService } from '../management-crud.service';
import { Field } from '../../../shared/generics/model/field.model';
import { Entity } from '../../../shared/generics/model/entity.model';
import { StakeholderAccount } from '../model/stakeholder-account.model';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cc-stakeholders-learners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CrudService, useClass: ManagementCrudService }],
  imports: [GenericTableComponent],
  template: `
    <div class="flex-row gap" style="width: 98%; height: 100%;">
      <cc-generic-table style="flex-grow: 1;"
        [title]="'Studenti'"
        [fieldConfiguration]="fields"
        [baseUrl]="baseUrl"
        (selectItem)="onSelect($event)" />
      <div style="width: 300px; height: 100%;">
        @if (selectedLearner()) {
          <cc-generic-table
            [title]="'Prijavljeni moduli'"
            [fieldConfiguration]="courseFields"
            [baseUrl]="enrolledCoursesUrl()"
            [noPagination]="true" />
        }
      </div>
    </div>
  `,
})
export class LearnersComponent {
  readonly baseUrl = environment.apiHost + 'management/learners/';
  readonly fields: Field[] = [
    { code: 'learnerType', type: 'radio', label: 'Tip studenta', required: true, options: [{ label: 'FTN', value: 'Regular' }, { label: 'FTN Inf', value: 'Commercial' }] },
    { code: 'index', type: 'string', label: 'Korisničko ime / Indeks', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'CRUD', type: 'CRUD', label: '', crud: { create: true, update: true, archive: true, secureDelete: true, filter: true, bulkCreate: true, bulkCreateDialogComponent: BulkAddComponent } },
  ];

  readonly courseFields: Field[] = [
    { code: 'code', type: 'string', label: 'Kod', required: true },
    { code: 'name', type: 'string', label: 'Naziv' },
  ];

  readonly selectedLearner = signal<StakeholderAccount | null>(null);
  readonly enrolledCoursesUrl = signal('');

  onSelect(entity: Entity): void {
    const learner = entity as StakeholderAccount;
    this.selectedLearner.set(learner);
    this.enrolledCoursesUrl.set(this.baseUrl + learner.id + '/courses');
  }
}
