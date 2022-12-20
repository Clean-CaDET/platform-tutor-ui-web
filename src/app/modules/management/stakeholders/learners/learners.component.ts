import { Component } from '@angular/core';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent {
  baseUrl = "https://localhost:44333/api/management/learners/";
  // Should add an interface/class for each field and separate CRUD operations into a different structure?
  fields = [
    { code: 'index', type: 'string', label: 'Indeks / Username', required: true },
    { code: 'password', type: 'password', label: 'Lozinka' },
    { code: 'name', type: 'string', label: 'Ime', required: true },
    { code: 'surname', type: 'string', label: 'Prezime', required: true },
    { code: 'email', type: 'email', label: 'Email' },
    { code: 'CRUD', type: 'CRUD', label: '', create: true, update: true, archive: true, delete: true, filter: true }
  ];
  selectedLearner: any;
  
  constructor() { }

  onSelect(learner) {
    this.selectedLearner = learner;
  }
}

interface Learner {
  id: number,
  index: string,
  name: string,
  surname: string,
  email: string,
  password: string
}
