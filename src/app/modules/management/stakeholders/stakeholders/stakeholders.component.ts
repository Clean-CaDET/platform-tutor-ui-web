import { Component, OnInit } from '@angular/core';
import { StakeholdersService } from '../stakeholders.service';

@Component({
  selector: 'cc-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit {
  columns: string[] = ['creationDate', 'name', 'surname', 'email', 'index', 'CRUD'];
  labels = {
    'creationDate' : 'Datum kreiranja',
    'name' : 'Ime',
    'surname' : 'Prezime',
    'email' : 'Email / Username',
    'index' : 'Indeks'
  }
  
  constructor(public service : StakeholdersService) { }

  ngOnInit(): void {}
}
