import { Component, OnDestroy, OnInit } from '@angular/core';
import { Unit } from '../../learning/model/unit.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';
import { EventService } from 'src/app/shared/events/event.service';
import { UnitProgressRating } from '../../learning/model/unit-progress-rating.model';
import { Subject, takeUntil } from 'rxjs';

enum AnalyticsType { Top10, Kc, Ai }

@Component({
  selector: 'cc-unit-analytics',
  templateUrl: './unit-analytics.component.html',
  styleUrls: ['./unit-analytics.component.scss']
})
export class UnitAnalyticsComponent implements OnInit, OnDestroy {
  private $destroy = new Subject<void>();

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
    this.route.params
    .pipe(takeUntil(this.$destroy))
    .subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.analyticsService
        .getUnits(this.courseId)
        .subscribe(units => {
          this.units = units.sort((u1, u2) => u1.order - u2.order);
          this.updateUnit(this.route.snapshot.queryParams);
        });
    });
    this.route.queryParams
    .pipe(takeUntil(this.$destroy))
    .subscribe((params: Params) => {
      if(!this.units?.length) return;
      this.updateUnit(params);
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  updateUnit(params: Params): void {
    if(!params.unitId) return;
    this.selectedKc = null;
    this.analyticsTypeDisplay = +params.display;

    this.selectedUnit = this.units.find(u => u.id == params.unitId);
    if(!this.selectedUnit) return;

    this.GetKnowledgeComponents(+params.kcId);
    this.analyticsService.getKcRatings(this.selectedUnit.id)
      .subscribe(ratings => this.calculateRatings(ratings));
  }

  private GetKnowledgeComponents(selectedKcId: number) {
    if (this.selectedUnit?.knowledgeComponents?.length > 0) {
      this.selectedKc = this.selectedUnit.knowledgeComponents.find(kc => kc.id == selectedKcId);
      return;
    }

    this.analyticsService.getKnowledgeComponents(this.selectedUnit.id).subscribe(kcs => {
      this.selectedUnit.knowledgeComponents = kcs.sort((k1, k2) => k1.order - k2.order);
      this.selectedKc = this.selectedUnit.knowledgeComponents.find(kc => kc.id == selectedKcId);
    });
  }

  calculateRatings(ratings: UnitProgressRating[]) {
    /*this.ratings = {};
    this.ratingAverages = {};
    let ids = new Set<number>();
    ratings.forEach(rating => {
      const kcId = rating.knowledgeComponentId;
      ids.add(kcId);
      if(!this.ratings[kcId]) this.ratings[kcId] = [rating];
      else this.ratings[kcId].push(rating);
    });

    ids.forEach(kcId => {
      const average = this.ratings[kcId].reduce((total: number, next: UnitProgressRating) => total + next.rating, 0) / this.ratings[kcId].length;
      this.ratingAverages[kcId] = Math.round(average*10) / 10
    });*/ //TODO: Rework
  }

  changeUnitSelection(event: any) {
    const unitId = event.value.id;
    this.router.navigate([], { queryParams: { unitId, display: AnalyticsType.Top10 } });
    // Triggers queryParams subscription
  }

  changeDisplay(kc: KnowledgeComponent, displayType: AnalyticsType) {
    this.router.navigate([], {
      queryParams: { kcId: kc?.id || "", display: displayType },
      queryParamsHandling: 'merge'
    });
  }

  exportToCSV(unit: Unit): void {
    this.eventService.getByKcs(unit.knowledgeComponents.map(kc => kc.id), unit.code).subscribe();
  }
}