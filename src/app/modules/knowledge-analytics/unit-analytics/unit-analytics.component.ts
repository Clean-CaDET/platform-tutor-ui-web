import { Component, OnInit } from '@angular/core';
import { Unit } from '../../learning/model/unit.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { EventService } from 'src/app/shared/events/event.service';

@Component({
  selector: 'cc-unit-analytics',
  templateUrl: './unit-analytics.component.html',
  styleUrls: ['./unit-analytics.component.scss']
})
export class UnitAnalyticsComponent implements OnInit {
  courseId: number;
  selectedUnit: Unit;
  units: Unit[];

  selectedKc: KnowledgeComponent;
  showKcAnalytics: boolean;
  showAssessmentAnalytics: boolean;

  constructor(private analyticsService: KnowledgeAnalyticsService, private eventService: EventService,
    private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.analyticsService
        .getUnits(this.courseId)
        .subscribe(units => {
          this.units = this.sortUnits(units);
          let unitId = this.route.snapshot.queryParams['unitId'];
          if(unitId) {
            this.selectedUnit = this.units.find(u => u.id == unitId);
          }
        });
    });
  }

  sortUnits(units: Unit[]): Unit[] {
    return units.sort((u1, u2) => u1.order - u2.order);
  }

  updateUnit(): void {
    this.selectedKc = null;
    this.showKcAnalytics = false;
    this.showAssessmentAnalytics = false;

    if(this.selectedUnit) {
      this.router.navigate([], {
        queryParams: { unitId: this.selectedUnit.id },
        queryParamsHandling: 'merge'
      });
      this.analyticsService.getKnowledgeComponents(this.selectedUnit.id)
        .subscribe(kcs => this.selectedUnit.knowledgeComponents = kcs.sort((k1, k2) => k1.order - k2.order));
    }
  }

  selectKc(kc: KnowledgeComponent, showKcAnalytics: boolean) {
    this.selectedKc = kc;
    this.showKcAnalytics = showKcAnalytics;
    this.showAssessmentAnalytics = !showKcAnalytics;
  }

  exportAllToCSV(): void {
    this.eventService.getAll().subscribe();
  }
}
