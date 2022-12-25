import { Component } from '@angular/core';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import {StakeholderAccount} from '../../model/stakeholder-account';
import {environment} from '../../../../../environments/environment';
import { Field } from 'src/app/shared/generics/model/field';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent {
  baseUrl = environment.apiHost + "management/learners/";
  fields: Field[] = [
    { code: 'index', type: 'string', label: 'Korisničko ime / Indeks', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'CRUD', type: 'CRUD', label: '', crud: {create: true, update: true, archive: true, delete: true, filter: true,
      bulkCreate: true, bulkCreateDialogComponent: BulkAddComponent}
    }
  ];
  selectedLearner: StakeholderAccount;

  constructor() { }

  onSelect(learner: StakeholderAccount): void {
    this.selectedLearner = learner;
  }
}
