import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { AssessmentItemStatistics } from '../model/assessment-item-statistics';
import { EventService } from 'src/app/shared/events/event.service';

@Component({
  selector: 'cc-ai-statistics',
  templateUrl: './ai-statistics.component.html',
  styleUrls: ['./ai-statistics.component.scss']
})
export class AiStatisticsComponent implements OnChanges {
  @Input() courseId: number;
  @Input() kcId: number;
  @Input() unitId: number;

  assessmentStatistics: AssessmentItemStatistics[];
  attemptsToPassGrouping: any;
  completionTimeBarsGrouping: any;

  constructor(private analyticsService: KnowledgeAnalyticsService, private eventService: EventService) {}

  ngOnChanges(): void {
    if(this.kcId) {
      this.analyticsService.getAssessmentItemStatistics(this.kcId.toString())
        .subscribe(data => {
          this.assessmentStatistics = data;
          this.createCharts();
        });
    } else {
      this.analyticsService.getTopMisconceptions(this.unitId)
        .subscribe(data => {
          this.assessmentStatistics = data;
          this.createCharts();
        });
    }
  }

  private createCharts() {
    this.attemptsToPassGrouping = {};
    this.completionTimeBarsGrouping = {};
    this.assessmentStatistics.forEach(ai => {
      this.completionTimeBarsGrouping[ai.aiId] = this.createTimeBars(ai.minutesToCompletion);
      this.createAttemptChart(ai);
    });
  }

  private createAttemptChart(ai: AssessmentItemStatistics): void {
    this.attemptsToPassGrouping[ai.aiId] = [];
    if(ai.totalPassed === 0) return;

    this.attemptsToPassGrouping[ai.aiId].push({
      name: '1',
      value: ai.attemptsToPass.filter(a => a === 1).length,
    });
    this.attemptsToPassGrouping[ai.aiId].push({
      name: '2',
      value: ai.attemptsToPass.filter(a => a === 2).length,
    });
    this.attemptsToPassGrouping[ai.aiId].push({
      name: '3',
      value: ai.attemptsToPass.filter(a => a === 3).length,
    });
    this.attemptsToPassGrouping[ai.aiId].push({
      name: '4 - 6',
      value: ai.attemptsToPass.filter(a => a >= 4 && a <= 6).length,
    });
    this.attemptsToPassGrouping[ai.aiId].push({
      name: '7+',
      value: ai.attemptsToPass.filter(a => a > 6).length,
    });
  }

  private createTimeBars(minutes: number[]): number[] {
    if(minutes.length == 0) return [0, 0, 0, 0];
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

  exportEvents(aiId: number) {
    this.eventService.getByAi(aiId).subscribe();
  }
}
