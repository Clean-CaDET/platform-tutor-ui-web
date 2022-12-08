import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StakeholdersService } from '../stakeholders.service';

@Component({
  selector: 'cc-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit {
  displaysLearners: boolean;
  data;
  columns: string[] = ['creationDate', 'name', 'surname', 'email'];
  labels = {
    'creationDate' : 'Datum kreiranja',
    'name' : 'Ime',
    'surname' : 'Prezime',
    'email' : 'Email / Username',
    'index' : 'Indeks'
  }
  
  constructor(private service : StakeholdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(!params['type']) return;
      this.displaysLearners = params['type'] == 'learners';
      if(this.displaysLearners) {
        this.columns.push('index');
      }
      this.columns.push('CRUD');
      this.service.getAll().subscribe(stakeholders => {
        this.data = stakeholders;
      });
    });
  }
}
