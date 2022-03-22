import {Component, Input, OnInit} from '@angular/core';
import {UnitService} from '../../domain/unit/unit.service';
import {Unit} from '../../domain/unit/unit.model';
import {KnowledgeComponent} from '../../domain/knowledge-component/model/knowledge-component.model';
import {Learner} from '../../learner/learner.model';
import {LearnerService} from '../../learner/learner.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {filter} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavbarService} from './navbar.service';

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  units: Unit[];
  knowledgeComponents: KnowledgeComponent[];
  learner: Learner;
  selectedUnit: Unit;
  selectedKC: KnowledgeComponent;
  @Input() isDarkTheme: boolean;

  constructor(private unitService: UnitService, private learnerService: LearnerService,
              private router: Router, private route: ActivatedRoute,
              private navbarService: NavbarService) {
    this.navbarService.invokeEvent.subscribe(value => {
      if (value === 'updateUnits') {
        this.updateUnits();
      } else if (value === 'updateKnowledgeComponents') {
        this.updateKnowledgeComponents(this.selectedUnit.id);
      }
    });
  }

  ngOnInit(): void {
    this.updateUnits();
    this.learnerService.learner$.subscribe(learner => {
      this.learner = learner;
      console.log(this.learner);
    });
    this.setupActiveUnitAndKCUpdate();
  }

  private updateUnits(): void {
    this.unitService.getUnits().subscribe(units => this.units = units);
  }

  private setupActiveUnitAndKCUpdate(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      map(e => this.getParams(this.route))
    ).subscribe(params => {
      if (params.unitId) {
        this.onUnitSelected(+params.unitId);
      }
      if (params.kcId) {
        this.selectedKC = this.findKC(this.selectedUnit.knowledgeComponents, +params.kcId);
      }
    });
  }

  private getParams(route: ActivatedRoute): Params {
    let params = route.snapshot.params;
    route.children?.forEach(c => {
      params = {
        ...this.getParams(c),
        ...params
      };
    });
    return params;
  }

  private onUnitSelected(unitId): void {
    this.unitService.getUnit(unitId, this.learner.id).subscribe(fullUnit => {
      this.knowledgeComponents = fullUnit.knowledgeComponents;
      this.selectedUnit = fullUnit;
      this.selectedKC = null;
    });
  }

  private updateKnowledgeComponents(unitId): void {
    this.unitService.getUnit(unitId, this.learner.id).subscribe(fullUnit => {
      this.selectedUnit = fullUnit;
    });
  }

  private findKC(knowledgeComponents: KnowledgeComponent[], id: number): KnowledgeComponent {
    for (const kc of knowledgeComponents) {
      if (kc.id === id) {
        return kc;
      }

      const child = this.findKC(kc.knowledgeComponents, id);
      if (child) {
        return child;
      }
    }
    return null;
  }

  onLogout(): void {
    this.learnerService.logout();
    this.resetNavBar();
  }

  resetNavBar(): void {
    this.selectedUnit = null;
    this.selectedKC = null;
  }
}
