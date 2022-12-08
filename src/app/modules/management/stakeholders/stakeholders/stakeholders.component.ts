import { Component, OnInit } from '@angular/core';
import { StakeholdersService } from '../stakeholders.service';

@Component({
  selector: 'cc-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit {
  fields = {
    index: {
      type: 'string',
      label: 'Indeks'
    },
    name: {
      type: 'string',
      label: 'Ime'
    },
    surname: {
      type: 'string',
      label: 'Prezime'
    },
    email: {
      type: 'email',
      label: 'Email / Username'
    },
    creationDate: {
      type: 'date',
      label: 'Datum kreiranja',
      readOnly: true
    },
    CRUD: {
      type: 'controls',
      label: ''
    }
  };
  
  constructor(public service : StakeholdersService) { }

  ngOnInit(): void {}
}
