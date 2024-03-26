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
  completionTimeBars: number[];
  passTimeBars: number[];

  constructor(private analyticsService: KnowledgeAnalyticsService) {}

  ngOnChanges(): void {
    this.analyticsService.getKnowledgeComponentStatistics(this.kcId.toString())
      .subscribe(data => {
        this.knowledgeComponentStatistics = data;
        this.createTotalCountCharts(data);
        this.createPercentageCharts(data);
        this.completionTimeBars = this.createTimeBars(data.minutesToCompletion);
        this.passTimeBars = this.createTimeBars(data.minutesToPass);
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

  private createTimeBars(minutes: number[]): number[] {
    if(minutes.length == 0) return [];
    minutes.sort((a, b) => a - b);
    const minutesWithoutOutliers = this.removeOutliers(minutes);
    const index10 = Math.min(Math.round(minutesWithoutOutliers.length * 0.1), minutesWithoutOutliers.length-1);
    const index35 = Math.min(Math.round(minutesWithoutOutliers.length * 0.35), minutesWithoutOutliers.length-1);
    const index70 = Math.min(Math.round(minutesWithoutOutliers.length * 0.7), minutesWithoutOutliers.length-1);
    const index95 = Math.min(Math.round(minutesWithoutOutliers.length * 0.95), minutesWithoutOutliers.length-1);
    return [
      this.round(minutesWithoutOutliers[index10]),
      this.round(minutesWithoutOutliers[index35]),
      this.round(minutesWithoutOutliers[index70]),
      this.round(minutesWithoutOutliers[index95])
    ]
  }

  private round(number: number) : number {
    return Math.round(number * 10) / 10;
  }

  private removeOutliers(numbers: number[]) {
    const q1 = numbers[Math.floor((numbers.length / 4))];
    const q3 = numbers[Math.ceil((numbers.length * (3 / 4))) - 1];
    const iqr = q3 - q1;

    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return numbers.filter(num => num >= lowerBound && num <= upperBound);
  }
}
