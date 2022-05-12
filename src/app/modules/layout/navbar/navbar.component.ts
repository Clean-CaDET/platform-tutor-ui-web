import {Component, Input, OnInit} from '@angular/core';
import { ROLE } from 'src/app/shared/constants';
import {Learner} from '../../../infrastructure/auth/learner.model';
import {LearnerService} from '../../../infrastructure/auth/learner.service';

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  role: string;
  learner: Learner;
  @Input() isDarkTheme: boolean;

  constructor(private learnerService: LearnerService) {}

  ngOnInit(): void {
    this.learnerService.learner$.subscribe(learner => {
      this.learner = learner;
      this.role = localStorage.getItem(ROLE);
    });
  }

  onLogout(): void {
    this.learnerService.logout();
  }
}
