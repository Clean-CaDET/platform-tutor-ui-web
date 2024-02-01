import { Component, Inject, Input, OnInit } from '@angular/core';
import { SubmissionStatistics } from '../model/submission-statistics';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cc-submission-statistics',
  templateUrl: './submission-statistics.component.html',
  styleUrls: ['./submission-statistics.component.scss']
})
export class SubmissionStatisticsComponent implements OnInit {
  aiId: number;
  kcId: number;
  submissionStatistics: SubmissionStatistics[];

  constructor(@Inject(MAT_DIALOG_DATA) data: { kcId:number, aiId:number },
    private service: KnowledgeAnalyticsService) {
      this.kcId = data.kcId;
      this.aiId = data.aiId;
    }

  ngOnInit(): void {
    this.service.getSubmissionStatistics(this.kcId, this.aiId)
      .subscribe(statistics => this.submissionStatistics = statistics);
  }

}
