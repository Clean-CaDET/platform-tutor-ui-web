import { Component, OnInit } from '@angular/core';
import { LearnerAnalyticsService } from '../learner-analytics.service';
import { LearningEvent } from './learning-event';
import {ngxCsv} from 'ngx-csv';

@Component({
  selector: 'cc-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit {
  events: LearningEvent[];
  count: number;
  page = 1;
  pageSize = 50;
  displayedColumns: string[] = ['timeStamp', 'type', 'kcId', 'learnerId', 'specificData'];

  constructor(private analyticsService: LearnerAnalyticsService) { }

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents() {
    this.analyticsService.getEvents(this.page, this.pageSize).subscribe(data => {
      this.events = data.events.sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime());
      this.count = data.count;
    });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getEvents();
  }

  exportToCSV(): void {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Events',
      useBom: true,
      noDownload: false,
      headers: ['Timestamp', 'Type', 'Knowledge Component Id', 'Learner Id', 'Event-specific data']
    };

    const data = JSON.parse(JSON.stringify(this.events));
    for (const event of data) {
      if (event.specificData) {
        event.specificData = JSON.stringify(event.specificData);
      }
    }
    new ngxCsv(data, 'Events', options);
  }
}
