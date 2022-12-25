import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BulkAddComponent } from './bulk-add/bulk-add.component';
import {StakeholderAccount} from '../../model/stakeholder-account';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent {
  baseUrl = "https://localhost:44333/api/management/learners/";
  fields = [
    { code: 'index', type: 'string', label: 'Korisničko ime / Indeks', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'CRUD', type: 'CRUD', label: '',
      create: true, update: true, archive: true, delete: true, filter: true,
      bulkCreate: true, bulkCreateDialogComponent: BulkAddComponent
    }
  ];
  selectedLearner: StakeholderAccount;

  constructor(private dialog: MatDialog) { }

  onSelect(learner) {
    this.selectedLearner = learner;
  }
}
