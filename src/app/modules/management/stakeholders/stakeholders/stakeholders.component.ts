import { Component, OnInit } from '@angular/core';
import { StakeholdersService } from '../stakeholders.service';

@Component({
  selector: 'cc-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit {
  columns = {
    creationDate: 'date',
    name: 'string',
    surname: 'string',
    email: 'email',
    index: 'string',
    CRUD: 'controls'
  };
  labels = {
    creationDate : 'Datum kreiranja',
    name : 'Ime',
    surname : 'Prezime',
    email : 'Email / Username',
    index : 'Indeks'
  };
  
  constructor(public service : StakeholdersService) { }

  ngOnInit(): void {}
}
