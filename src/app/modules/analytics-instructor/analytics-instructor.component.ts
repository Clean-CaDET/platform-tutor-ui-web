import { Component, OnInit } from '@angular/core';
import { AnalyticsInstructorService } from './analytics-instructor.service';
import { LearningEvent } from './learning-event';

@Component({
  selector: 'cc-analytics-instructor',
  templateUrl: './analytics-instructor.component.html',
  styleUrls: ['./analytics-instructor.component.scss']
})
export class AnalyticsInstructorComponent implements OnInit {
  events: LearningEvent[];
  count: number;
  page = 1;
  pageSize = 50;
  displayedColumns: string[] = ['timeStamp', 'type', 'kcId', 'learnerId', 'specificData'];

  constructor(private analyticsService: AnalyticsInstructorService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents() {
    this.analyticsService.getAnalytics(this.page, this.pageSize).subscribe(data => {
      this.events = data.events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
      this.count = data.count;
    });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getEvents();
  }
}
