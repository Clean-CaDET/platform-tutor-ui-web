import { Component } from '@angular/core';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import {StakeholderAccount} from '../../model/stakeholder-account.model';
import {environment} from '../../../../../environments/environment';
import { Field } from 'src/app/shared/generics/model/field.model';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent {
  baseUrl = environment.apiHost + "management/learners/";
  fields: Field[] = [
    { code: 'learnerType', type: 'radio', label: 'Tip polaznika', required: true, options: [{label: "FTN", value: "Regular"}, {label: "FTN Inf", value: "Commercial"}] },
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

  courseFields: Field[] = [
    { code: 'code', type: 'string', label: 'Kod', required: true },
    { code: 'name', type: 'string', label: 'Naziv' }
  ];
  enrolledCoursesUrl: string;

  constructor() { }

  onSelect(learner: StakeholderAccount): void {
    this.selectedLearner = learner;
    this.enrolledCoursesUrl = this.baseUrl + learner.id + "/courses";
  }
}
