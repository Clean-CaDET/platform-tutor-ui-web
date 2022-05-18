import { Component, OnInit } from '@angular/core';
import { Unit } from '../../domain/unit/unit.model';
import { LearnerService } from '../../learner/learner.service';
import { LearnerAnalyticsService } from '../learner-analytics.service';

@Component({
  selector: 'cc-kc-statistics',
  templateUrl: './kc-statistics.component.html',
  styleUrls: ['./kc-statistics.component.scss']
})
export class KcStatisticsComponent implements OnInit {
  knowledgeComponentStatistics: any[];
  totalCountChartData = {};
  percentageChartData = {};

  unitId = "0";
  units: Unit[];
  groupId = "0";
  groups: any[];

  constructor(private analyticsService: LearnerAnalyticsService, private learnerService: LearnerService) { }

  ngOnInit(): void {
    this.analyticsService.getUnits().subscribe(units => this.units = units);
    this.learnerService.getGroups().subscribe(groups => this.groups = groups);
  }

  updateStatistics() {
    if(!+this.unitId) return;
    this.getKcStatistics();
  }

  private getKcStatistics() {
    this.analyticsService.getKnowledgeComponentStatistics(this.groupId, this.unitId).subscribe(data => {
      this.knowledgeComponentStatistics = data;
      this.knowledgeComponentStatistics.forEach(kc => {
        this.createTotalCountCharts(kc);
        this.createPercentageCharts(kc);
      });
    });
  }

  private createTotalCountCharts(kc: any) {
    this.totalCountChartData[kc.kcCode] = new Array();
    this.totalCountChartData[kc.kcCode].push({
      'name': 'Broj prijava',
      'value': kc.totalRegistered
    });
    this.totalCountChartData[kc.kcCode].push({
      'name': 'Broj započetih',
      'value': kc.totalStarted
    });
    this.totalCountChartData[kc.kcCode].push({
      'name': 'Broj pregledanih',
      'value': kc.totalCompleted
    });
    this.totalCountChartData[kc.kcCode].push({
      'name': 'Broj rešenih',
      'value': kc.totalPassed
    });
  }

  private createPercentageCharts(kc: any) {
    this.percentageChartData[kc.kcCode] = new Array();
    this.percentageChartData[kc.kcCode].push({
      'name': '% započetih',
      'value': kc.totalStarted * 100 / kc.totalRegistered
    });
    this.percentageChartData[kc.kcCode].push({
      'name': '% pregledanih',
      'value': kc.totalCompleted * 100 / kc.totalRegistered
    });
    this.percentageChartData[kc.kcCode].push({
      'name': '% rešenih',
      'value': kc.totalPassed * 100 / kc.totalRegistered
    });
  }
}
