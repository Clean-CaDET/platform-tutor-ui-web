import { Component, OnInit } from '@angular/core';
import { Unit } from '../../learning/unit/unit.model';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';

@Component({
  selector: 'cc-kc-statistics',
  templateUrl: './kc-statistics.component.html',
  styleUrls: ['./kc-statistics.component.scss'],
})
export class KcStatisticsComponent implements OnInit {
  knowledgeComponentStatistics: any[];
  totalCountChartData = {};
  percentageChartData = {};
  timeChartData = {};

  unitId = '0';
  units: Unit[];
  groupId = '0';
  groups: any[];

  constructor(
    private domainKnowledgeAnalyticsService: KnowledgeAnalyticsService
  ) {}

  ngOnInit(): void {
    this.domainKnowledgeAnalyticsService
      .getUnits()
      .subscribe((units) => (this.units = units));
    this.domainKnowledgeAnalyticsService
      .getGroups()
      .subscribe((groups) => (this.groups = groups));
  }

  updateStatistics() {
    if (!+this.unitId) return;
    this.getKcStatistics();
  }

  private getKcStatistics() {
    this.domainKnowledgeAnalyticsService
      .getKnowledgeComponentStatistics(this.groupId, this.unitId)
      .subscribe((data) => {
        this.knowledgeComponentStatistics = data;
        this.knowledgeComponentStatistics.forEach((kc) => {
          this.createTotalCountCharts(kc);
          this.createPercentageCharts(kc);
          this.createTimeBoxData(kc);
        });
      });
  }

  private createTotalCountCharts(kc: any) {
    this.totalCountChartData[kc.kcCode] = new Array();
    this.totalCountChartData[kc.kcCode].push({
      name: 'Broj prijava',
      value: kc.totalRegistered,
    });
    this.totalCountChartData[kc.kcCode].push({
      name: 'Broj započelih',
      value: kc.totalStarted,
    });
    this.totalCountChartData[kc.kcCode].push({
      name: 'Broj pregledanih',
      value: kc.totalCompleted,
    });
    this.totalCountChartData[kc.kcCode].push({
      name: 'Broj rešenih',
      value: kc.totalPassed,
    });
  }

  private createPercentageCharts(kc: any) {
    this.percentageChartData[kc.kcCode] = new Array();
    this.percentageChartData[kc.kcCode].push({
      name: '% prijavljenih',
      value: (kc.totalRegistered * 100) / kc.totalRegistered,
    });
    this.percentageChartData[kc.kcCode].push({
      name: '% započelih',
      value: (kc.totalStarted * 100) / kc.totalRegistered,
    });
    this.percentageChartData[kc.kcCode].push({
      name: '% pregledanih',
      value: (kc.totalCompleted * 100) / kc.totalRegistered,
    });
    this.percentageChartData[kc.kcCode].push({
      name: '% rešenih',
      value: (kc.totalPassed * 100) / kc.totalRegistered,
    });
  }

  private createTimeBoxData(kc: any) {
    delete this.timeChartData[kc.kcCode];
    if (kc.minutesToCompletion.length == 0 && kc.minutesToPass.length == 0)
      return;

    this.timeChartData[kc.kcCode] = new Array();
    if (kc.minutesToCompletion.length != 0) {
      this.timeChartData[kc.kcCode].push({
        name: 'Vreme pregleda (u minutima)',
        series: this.createTimeSeries(kc.minutesToCompletion),
      });
    }
    if (kc.minutesToPass.length != 0) {
      this.timeChartData[kc.kcCode].push({
        name: 'Vreme rešavanja (u minutima)',
        series: this.createTimeSeries(kc.minutesToPass),
      });
    }
  }

  private createTimeSeries(minutes: number[]) {
    let result = new Array();
    minutes.forEach((m) => result.push({ name: 'a', value: m }));
    return result;
  }
}
