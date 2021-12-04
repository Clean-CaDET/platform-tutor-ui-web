import {Component, OnInit} from '@angular/core';
import {UnitService} from '../content/unit/unit.service';
import {Unit} from '../content/unit/model/unit.model';
import {KnowledgeComponent} from '../content/knowledge-component/model/knowledge-component.model';
import {Learner} from '../users/model/learner.model';
import {LearnerService} from '../users/learner.service';
import {NavbarService} from './navbar.service';


export interface ContentNode {
  name: string;
  link: string;
  data?: any;
  children?: ContentNode[];
}

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  units: Unit[];
  knowledgeComponents: KnowledgeComponent[];
  learner: Learner;
  selectedUnit: Unit;
  selectedKC: KnowledgeComponent;
  unitButtonText = 'Select Unit';
  kcButtonText = 'Select Knowledge Component';

  constructor(private unitService: UnitService, private learnerService: LearnerService,
              private navBarService: NavbarService) {
  }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(units => this.units = units);
    this.learnerService.learner$.subscribe(learner => this.learner = learner);
  }

  onUnitSelected(unit): void {
    this.knowledgeComponents = unit.knowledgeComponents;
    this.selectedUnit = unit;
    this.unitButtonText = unit.name;
    this.kcButtonText = 'Select Knowledge Component';
    this.navBarService.setUnit(unit);
  }

  onKCSelected(kc): void {
    this.selectedKC = kc;
    this.kcButtonText = kc.name;
  }

  onLogout(): void {
    this.learnerService.logout();
    this.kcButtonText = 'Select Knowledge Component';
    this.unitButtonText = 'Select Unit';
  }
}
