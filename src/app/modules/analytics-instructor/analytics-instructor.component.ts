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
  displayedColumns: string[] = ['timeStamp', 'type', 'kcId', 'learnerId', 'specificData'];

  constructor(private analyticsService: AnalyticsInstructorService) { }

  ngOnInit(): void {
    this.analyticsService.getAnalytics().subscribe(events => {
      this.events = events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
    });
  }

}
