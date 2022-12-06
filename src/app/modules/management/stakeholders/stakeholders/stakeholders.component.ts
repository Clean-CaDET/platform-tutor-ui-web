import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StakeholdersService } from '../../stakeholders.service';

@Component({
  selector: 'cc-stakeholders',
  templateUrl: './stakeholders.component.html',
  styleUrls: ['./stakeholders.component.scss']
})
export class StakeholdersComponent implements OnInit {
  displaysLearners: boolean;
  dataSource;
  displayedColumns: string[] = ['creationDate', 'name', 'surname', 'email'];
  
  constructor(private service : StakeholdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(!params['type']) return;
      this.displaysLearners = params['type'] == 'learners';
      if(this.displaysLearners) {
        this.displayedColumns.push('index');
      }
      this.displayedColumns.push('controls');
      this.service.GetAll(this.displaysLearners).subscribe(stakeholders => {
        this.dataSource = stakeholders;
      });
    });
  }
}
