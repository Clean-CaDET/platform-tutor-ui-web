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
  @Input() assessmentStatistics: AssessmentItemStatistics[];

  attemptsToPassGrouping: any;
  timeChartData: any;

  constructor(private analyticsService: KnowledgeAnalyticsService, private eventService: EventService) {}

  ngOnChanges(): void {
    if(this.kcId) {
      this.analyticsService.getAssessmentItemStatistics(this.kcId.toString())
        .subscribe(data => {
          this.assessmentStatistics = data;
          this.createCharts();
        });
      } else if(this.assessmentStatistics) {
        this.createCharts();
      }
  }

  private createCharts() {
    this.timeChartData = {};
    this.attemptsToPassGrouping = {};
    this.assessmentStatistics.forEach(ai => {
      this.createTimeBoxData(ai);
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

  private createTimeBoxData(ai: AssessmentItemStatistics): void {
    this.timeChartData[ai.aiId] = [];
    if (ai.minutesToCompletion.length === 0) return;
    
    this.timeChartData[ai.aiId].push({
      name: 'Vreme pregleda do prvog pokušaja (u minutima)',
      series: this.createTimeSeries(ai.minutesToCompletion),
    });
  }

  private createTimeSeries(minutes: number[]): number[] {
    // TODO: Does not match return value? (returns number[], but result contains objects)
    const result: any = [];
    minutes.forEach((m) => result.push({ name: 'a', value: m }));
    return result;
  }

  exportEvents(aiId: number) {
    this.eventService.getByAi(aiId).subscribe();
  }
}
