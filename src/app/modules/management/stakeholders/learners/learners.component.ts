import { Component, OnInit } from '@angular/core';
import { StakeholdersService as LearnersService } from './learners.service';

@Component({
  selector: 'cc-stakeholders-learners',
  templateUrl: './learners.component.html',
  styleUrls: ['./learners.component.scss']
})
export class LearnersComponent implements OnInit {
  fields = [
    {
      code: 'index',
      type: 'string',
      label: 'Indeks / Username',
      required: true
    },
    {
      code: 'name',
      type: 'string',
      label: 'Ime',
      required: true
    },
    {
      code: 'surname',
      type: 'string',
      label: 'Prezime',
      required: true
    },
    {
      code: 'email',
      type: 'email',
      label: 'Email'
    },
    {
      code: 'creationDate',
      type: 'date',
      label: 'Datum kreiranja',
      readOnly: true
    },
    {
      code: 'CRUD',
      type: 'CRUD',
      label: '',
      create: true,
      update: true,
      archive: true,
      delete: true
    }
  ];
  
  constructor(public service : LearnersService) { }

  ngOnInit(): void {}
}
