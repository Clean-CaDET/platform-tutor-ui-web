import {Component, Input, OnChanges} from '@angular/core';
import {KnowledgeComponentStatistics} from '../model/knowledge-component-statistics.model';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';

@Component({
  selector: 'cc-kc-statistics',
  templateUrl: './kc-statistics.component.html',
  styleUrls: ['./kc-statistics.component.scss'],
})
export class KcStatisticsComponent implements OnChanges {
  @Input() kcId: number;

  knowledgeComponentStatistics: KnowledgeComponentStatistics;
  
  totalCountChartData: any = {};
  percentageChartData: any = {};
  timeChartData: any = {};

  constructor(private analyticsService: KnowledgeAnalyticsService) {}

  ngOnChanges(): void {
    this.analyticsService.getKnowledgeComponentStatistics(this.kcId.toString())
      .subscribe(data => {
        this.knowledgeComponentStatistics = data;
        this.createTotalCountCharts(data);
        this.createPercentageCharts(data);
        this.createTimeBoxData(data);
      });
  }
  
  private createTotalCountCharts(kc: KnowledgeComponentStatistics): void {
    this.totalCountChartData = [];
    this.totalCountChartData.push({
      name: '# prijavljenih',
      value: kc.totalRegistered,
    });
    this.totalCountChartData.push({
      name: '# započelih',
      value: kc.totalStarted,
    });
    this.totalCountChartData.push({
      name: '# pregledanih',
      value: kc.totalCompleted,
    });
    this.totalCountChartData.push({
      name: '# rešenih',
      value: kc.totalPassed,
    });
  }

  private createPercentageCharts(kc: KnowledgeComponentStatistics): void {
    this.percentageChartData = [];
    if(kc.totalRegistered === 0) return;

    this.percentageChartData.push({
      name: '% prijavljenih',
      value: (kc.totalRegistered * 100) / kc.totalRegistered,
    });
    this.percentageChartData.push({
      name: '% započelih',
      value: (kc.totalStarted * 100) / kc.totalRegistered,
    });
    this.percentageChartData.push({
      name: '% pregledanih',
      value: (kc.totalCompleted * 100) / kc.totalRegistered,
    });
    this.percentageChartData.push({
      name: '% rešenih',
      value: (kc.totalPassed * 100) / kc.totalRegistered,
    });
  }

  private createTimeBoxData(kc: KnowledgeComponentStatistics): void {
    this.timeChartData = [];

    if (kc.minutesToCompletion.length !== 0) {
      this.timeChartData.push({
        name: 'Vreme pregleda (u minutima)',
        series: this.createTimeSeries(kc.minutesToCompletion),
      });
    }
    if (kc.minutesToPass.length !== 0) {
      this.timeChartData.push({
        name: 'Vreme rešavanja (u minutima)',
        series: this.createTimeSeries(kc.minutesToPass),
      });
    }
  }

  private createTimeSeries(minutes: number[]): number[] {
    // TODO: Does not match return value? (returns number[], but result contains objects)
    const result: any = [];
    minutes.forEach((m) => result.push({ name: 'a', value: m }));
    return result;
  }
}
