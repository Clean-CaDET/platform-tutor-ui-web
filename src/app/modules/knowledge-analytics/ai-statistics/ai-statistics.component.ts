import { Component, Input, OnChanges } from '@angular/core';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';

@Component({
  selector: 'cc-ai-statistics',
  templateUrl: './ai-statistics.component.html',
  styleUrls: ['./ai-statistics.component.scss']
})
export class AiStatisticsComponent implements OnChanges {
  @Input() kcId: number;
  @Input() groupId: string;


  constructor(private analyticsService: KnowledgeAnalyticsService) {}

  ngOnChanges(): void {
    /*this.analyticsService.getKnowledgeComponentStatistics(this.groupId, this.kcId.toString())
      .subscribe(data => {
        
      });*/
  }

}
