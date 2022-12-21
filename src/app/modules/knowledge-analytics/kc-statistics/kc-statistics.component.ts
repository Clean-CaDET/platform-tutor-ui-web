import {Component, OnInit} from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { Unit } from '../../learning/unit/unit.model';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import {ActivatedRoute, Params} from '@angular/router';
import {KnowledgeComponentStatistics} from '../model/knowledge-component-statistics';
import {Group} from '../model/group';

@Component({
  selector: 'cc-kc-statistics',
  templateUrl: './kc-statistics.component.html',
  styleUrls: ['./kc-statistics.component.scss'],
})
export class KcStatisticsComponent implements OnInit {
  knowledgeComponentStatistics: KnowledgeComponentStatistics[] = [];
  totalCountChartData = {};
  percentageChartData = {};
  timeChartData = {};

  unitId = '0';
  units: Unit[];
  groupId = '0';
  groups: Group[];

  exportOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Events',
    useBom: true,
    noDownload: false,
    headers: [
      'Timestamp',
      'Type',
      'Knowledge Component Id',
      'Learner Id',
      'Event-specific data',
    ],
  };

  constructor(
    private domainKnowledgeAnalyticsService: KnowledgeAnalyticsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.domainKnowledgeAnalyticsService
        .getUnits(+params.courseId)
        .subscribe((units) => {
          this.units = units; });
      this.domainKnowledgeAnalyticsService
        .getGroups(+params.courseId)
        .subscribe((groups) => (this.groups = groups));
    });
  }

  updateStatistics(): void {
    if (!+this.unitId) { return; }
    this.getKcStatistics();
  }

  private getKcStatistics(): void {
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

  private createTotalCountCharts(kc: KnowledgeComponentStatistics): void {
    this.totalCountChartData[kc.kcCode] = [];
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

  private createPercentageCharts(kc: KnowledgeComponentStatistics): void {
    this.percentageChartData[kc.kcCode] = [];
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

  private createTimeBoxData(kc: KnowledgeComponentStatistics): void {
    delete this.timeChartData[kc.kcCode];
    if (kc.minutesToCompletion.length === 0 && kc.minutesToPass.length === 0) {
      return;
    }

    this.timeChartData[kc.kcCode] = [];
    if (kc.minutesToCompletion.length !== 0) {
      this.timeChartData[kc.kcCode].push({
        name: 'Vreme pregleda (u minutima)',
        series: this.createTimeSeries(kc.minutesToCompletion),
      });
    }
    if (kc.minutesToPass.length !== 0) {
      this.timeChartData[kc.kcCode].push({
        name: 'Vreme rešavanja (u minutima)',
        series: this.createTimeSeries(kc.minutesToPass),
      });
    }
  }

  private createTimeSeries(minutes: number[]): number[]{
    const result = [];
    minutes.forEach((m) => result.push({ name: 'a', value: m }));
    return result;
  }

  exportAllToCSV(): void {
    this.domainKnowledgeAnalyticsService.getAllEvents().subscribe((data) => {
      const allEvents = data.sort(
        (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
      );
      for (const event of allEvents) {
        if (event.specificData) {
          event.specificData = JSON.stringify(event.specificData);
        }
      }
      new ngxCsv(allEvents, 'Events', this.exportOptions);
    });
  }
}
