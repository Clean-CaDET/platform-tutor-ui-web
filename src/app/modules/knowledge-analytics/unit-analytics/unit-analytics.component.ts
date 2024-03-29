import { Component, OnInit } from '@angular/core';
import { Unit } from '../../learning/model/unit.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { EventService } from 'src/app/shared/events/event.service';
import { KnowledgeComponentRate } from '../../learning/model/knowledge-component-rate.model';

enum AnalyticsType { Top10, Kc, Ai }

@Component({
  selector: 'cc-unit-analytics',
  templateUrl: './unit-analytics.component.html',
  styleUrls: ['./unit-analytics.component.scss']
})
export class UnitAnalyticsComponent implements OnInit {
  courseId: number;
  selectedUnit: Unit;
  units: Unit[];

  ratings: any;
  ratingAverages: any;

  selectedKc: KnowledgeComponent;
  analyticsTypeDisplay: AnalyticsType;

  public get AnalyticsType(): typeof AnalyticsType {
    return AnalyticsType; 
  }

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
            this.updateUnit();
          }
        });
    });
  }

  sortUnits(units: Unit[]): Unit[] {
    return units.sort((u1, u2) => u1.order - u2.order);
  }

  updateUnit(): void {
    this.selectedKc = null;
    this.analyticsTypeDisplay = AnalyticsType.Top10;

    if(this.selectedUnit) {
      this.router.navigate([], {
        queryParams: { unitId: this.selectedUnit.id },
        queryParamsHandling: 'merge'
      });

      if(!this.selectedUnit.knowledgeComponents || this.selectedUnit.knowledgeComponents.length == 0) {
        this.analyticsService.getKnowledgeComponents(this.selectedUnit.id)
          .subscribe(kcs => this.selectedUnit.knowledgeComponents = kcs.sort((k1, k2) => k1.order - k2.order));
      }
      this.analyticsService.getKcRatings(this.selectedUnit.id)
        .subscribe(ratings => this.calculateRatings(ratings));
    }
  }

  calculateRatings(ratings: KnowledgeComponentRate[]) {
    this.ratings = {};
    this.ratingAverages = {};
    let ids = new Set<number>();
    ratings.forEach(rating => {
      const kcId = rating.knowledgeComponentId;
      ids.add(kcId);
      if(!this.ratings[kcId]) this.ratings[kcId] = [rating];
      else this.ratings[kcId].push(rating);
    });

    ids.forEach(kcId => {
      const average = this.ratings[kcId].reduce((total: number, next: KnowledgeComponentRate) => total + next.rating, 0) / this.ratings[kcId].length;
      this.ratingAverages[kcId] = Math.round(average*10) / 10
    });
  }

  changeDisplay(kc: KnowledgeComponent, displayType: AnalyticsType) {
    this.selectedKc = kc;
    this.analyticsTypeDisplay = displayType;
  }

  exportToCSV(unit: Unit): void {
    this.eventService.getByKcs(unit.knowledgeComponents.map(kc => kc.id), unit.code).subscribe();
  }
}