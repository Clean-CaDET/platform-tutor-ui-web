import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NavigationEnd, Params, ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { KnowledgeComponent } from 'src/app/modules/domain/knowledge-component/model/knowledge-component.model';
import { Unit } from 'src/app/modules/domain/unit/unit.model';
import { UnitService } from 'src/app/modules/domain/unit/unit.service';
import { InterfacingInstructor } from 'src/app/modules/instructor/interfacing-instructor.service';
import { Learner } from 'src/app/modules/learner/learner.model';

@Component({
  selector: 'cc-learner-controls',
  templateUrl: './learner-controls.component.html',
  styleUrls: ['./learner-controls.component.scss']
})
export class LearnerControlsComponent implements OnInit, OnChanges, OnDestroy {
  units: Unit[];
  knowledgeComponents: KnowledgeComponent[];
  selectedUnit: Unit;
  selectedKC: KnowledgeComponent;
  @Input() learner: Learner;

  constructor(private unitService: UnitService,
    private router: Router, private route: ActivatedRoute,
    private instructor: InterfacingInstructor) { }

  ngOnInit(): void {
    this.instructor.observedAeEvaluations.subscribe(() => this.updateKnowledgeComponents(this.selectedUnit.id));
    this.setupActiveUnitAndKCUpdate();
  }

  ngOnChanges(): void {
    if (this.learner == null) {
      this.resetNavBar();
    }
    else {
      this.updateUnits();
    }
  }

  ngOnDestroy(): void {
    this.instructor.observedAeEvaluations.unsubscribe();
  }

  private updateUnits(): void {
    this.unitService.getUnits().subscribe(units => {
      this.units = units;
    });
  }

  private setupActiveUnitAndKCUpdate(): void {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      map(e => this.getParams(this.route))
    ).subscribe(params => {
      if (this.unitIsChanged(params)) {
        this.selectNewUnit(params);
      } else if (params.kcId) {
        this.selectedKC = this.findKC(this.selectedUnit.knowledgeComponents, +params.kcId);
      }
    });
  }

  private unitIsChanged(params: Params) {
    return params.unitId && this.selectedUnit?.id != params.unitId;
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

  private selectNewUnit(params: Params): void {
    this.unitService.getUnit(+params.unitId, this.learner.id).subscribe(fullUnit => {
      this.knowledgeComponents = fullUnit.knowledgeComponents;
      this.selectedUnit = fullUnit;
      this.selectedKC = params.kcId ? this.findKC(this.selectedUnit.knowledgeComponents, +params.kcId) : null;
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

  resetNavBar(): void {
    this.selectedUnit = null;
    this.selectedKC = null;
  }
}
