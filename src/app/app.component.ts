import {Component, OnInit} from '@angular/core';
import { LearnerService } from './modules/users/learner.service';
import { Learner } from './modules/users/learner.model';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  learner: Learner;

  constructor(private learnerService: LearnerService) {
  }

  ngOnInit(): void {
    this.opened = true;
    this.learnerService.learner$.subscribe(learner => this.learner = learner);
  }

  onLogout(): void {
    this.learnerService.logout();
  }

  toggl(): void {
    this.opened = !this.opened;
  }
}
