import {Component, Input, OnInit} from '@angular/core';
import {UnitService} from '../../domain/unit/unit.service';
import {Unit} from '../../domain/unit/unit.model';
import {KnowledgeComponent} from '../../domain/knowledge-component/model/knowledge-component.model';
import {Learner} from '../../learner/learner.model';
import {LearnerService} from '../../learner/learner.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';
import {InterfacingInstructor} from '../../instructor/interfacing-instructor.service';

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  learner: Learner;
  @Input() isDarkTheme: boolean;

  constructor(private learnerService: LearnerService) {
  }

  ngOnInit(): void {
    this.learnerService.learner$.subscribe(learner => {
      this.learner = learner;
    });
  }

  onLogout(): void {
    this.learnerService.logout();
  }
}
