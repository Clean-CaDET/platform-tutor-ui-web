import { Component, OnInit } from '@angular/core';
import { LearningEvent } from './learning-event';
import { ngxCsv } from 'ngx-csv';
import { KnowledgeAnalyticsService } from '../knowledge-analytics.service';

@Component({
  selector: 'cc-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss'],
})
export class EventsTableComponent implements OnInit {
  events: LearningEvent[];
  allEvents: LearningEvent[];
  count: number;
  page = 1;
  pageSize = 50;
  displayedColumns: string[] = [
    'timeStamp',
    'type',
    'kcId',
    'learnerId',
    'specificData',
  ];
  exportOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Events',
    useBom: true,
    noDownload: false,
    headers: [
      'Timestamp',
      'Type',
      'Knowledge Component Id',
      'Learner Id',
      'Event-specific data',
    ],
  };

  constructor(
    private domainKnowledgeAnalyticsService: KnowledgeAnalyticsService
  ) {}

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents() {
    this.domainKnowledgeAnalyticsService
      .getEvents(this.page, this.pageSize)
      .subscribe((data) => {
        this.events = data.events.sort(
          (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
        );
        this.count = data.count;
      });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getEvents();
  }

  exportToCSV(): void {
    const data = JSON.parse(JSON.stringify(this.events));
    for (const event of data) {
      if (event.specificData) {
        event.specificData = JSON.stringify(event.specificData);
      }
    }
    new ngxCsv(data, 'Events', this.exportOptions);
  }

  exportAllToCSV(): void {
    this.domainKnowledgeAnalyticsService.getAllEvents().subscribe((data) => {
      this.allEvents = data.sort(
        (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
      );
      for (const event of this.allEvents) {
        if (event.specificData) {
          event.specificData = JSON.stringify(event.specificData);
        }
      }
      new ngxCsv(this.allEvents, 'Events', this.exportOptions);
    });
  }
}
