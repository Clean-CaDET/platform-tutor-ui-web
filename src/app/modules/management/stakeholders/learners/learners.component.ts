import { Component, OnInit } from '@angular/core';
import { StakeholdersService as LearnersService } from './learners.service';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent implements OnInit {
  fields = {
    index: {
      type: 'string',
      label: 'Indeks / Username',
      required: true
    },
    name: {
      type: 'string',
      label: 'Ime',
      required: true
    },
    surname: {
      type: 'string',
      label: 'Prezime',
      required: true
    },
    email: {
      type: 'email',
      label: 'Email'
    },
    creationDate: {
      type: 'date',
      label: 'Datum kreiranja',
      readOnly: true
    },
    CRUD: {
      type: 'CRUD',
      label: '',
      update: true,
      archive: true,
      delete: true
    }
  };
  
  constructor(public service : LearnersService) { }

  ngOnInit(): void {}
}
