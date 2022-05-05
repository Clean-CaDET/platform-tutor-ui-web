import { Component, OnInit } from '@angular/core';
import { LearnerAnalyticsService } from '../learner-analytics.service';

@Component({
  selector: 'cc-kcm-progress',
  templateUrl: './kcm-progress.component.html',
  styleUrls: ['./kcm-progress.component.scss']
})
export class KcmProgressComponent implements OnInit {
  learners: any[];
  count: number;
  page = 1;
  pageSize = 50;
  displayedColumns: string[] = ['name', 'mastery', 'attemptedCount', 'completedCount', 'totalCount'];

  constructor(private analyticsService: LearnerAnalyticsService) { }

  ngOnInit(): void {
    this.getLearnerProgress();
  }

  private getLearnerProgress() {
    this.analyticsService.getLearners(this.page, this.pageSize).subscribe(data => {
      this.learners = data.learners;
      this.count = data.count;
    });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getLearnerProgress();
  }

}
