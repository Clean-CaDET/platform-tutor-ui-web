import { Component, OnInit } from '@angular/core';
import { Unit } from '../../learning/model/unit.model';
import { Group } from '../model/group.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { ngxCsv } from 'ngx-csv';
import { KnowledgeComponent } from '../../learning/model/knowledge-component.model';

@Component({
  selector: 'cc-unit-analytics',
  templateUrl: './unit-analytics.component.html',
  styleUrls: ['./unit-analytics.component.scss']
})
export class UnitAnalyticsComponent implements OnInit {
  selectedUnit: Unit;
  units: Unit[];
  selectedGroupId = '0';
  groups: Group[];

  selectedKc: KnowledgeComponent;
  showKcAnalytics: boolean;
  showAssessmentAnalytics: boolean;

  constructor(private analyticsService: KnowledgeAnalyticsService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.analyticsService
        .getUnits(+params.courseId)
        .subscribe(units => {
          this.units = units;
          let unitId = this.route.snapshot.queryParams['unitId'];
          if(unitId) {
            this.selectedUnit = this.units.find(u => u.id == unitId);
          }
        });
      this.analyticsService
        .getGroups(+params.courseId)
        .subscribe((groups) => (this.groups = groups.results));
    });
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
    }
  }

  selectKc(kc: KnowledgeComponent, showKcAnalytics: boolean) {
    this.selectedKc = kc;
    this.showKcAnalytics = showKcAnalytics;
    this.showAssessmentAnalytics = !showKcAnalytics;
  }

  exportAllToCSV(): void {
    const exportOptions = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      noDownload: false,
      headers: [
        'Type',
        'Timestamp',
        'Knowledge Component Id',
        'Learner Id',
        'Event-specific data',
      ],
    };

    this.analyticsService.getAllEvents().subscribe((data) => {
      const allEvents = data.sort(
        (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
      );
      for (const event of allEvents) {
        if (event.specificData) {
          event.specificData = JSON.stringify(event.specificData);
        }
      }
      new ngxCsv(allEvents, 'Events', exportOptions);
    });
  }
}
