import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent, CalendarView, DAYS_OF_WEEK} from 'angular-calendar';
import {DateFormatter} from "./date-formatter";
import localeSr from '@angular/common/locales/sr-Latn';
import {registerLocaleData} from "@angular/common";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {CalendarService} from "./calendar.service";
import {ActivatedRoute, Params} from "@angular/router";
import {SessionEventsComponent} from "./session-events/session-events.component";
import {LearningEvent} from "../../../../knowledge-analytics/model/learning-event.model";
import {Learner} from "../../../model/learner.model";
import {Session} from "../../../model/session.model";

@Component({
  selector: 'cc-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: DateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit{
  constructor(private calendarService: CalendarService, private route: ActivatedRoute,
              private dialog: MatDialog) {
  }

  allSessions: Session[] = [];
  events: CalendarEvent[] = [];

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  locale: string = 'sr-Latn';

  learnerInfo: Learner;

  ngOnInit(): void {
    registerLocaleData(localeSr);
    this.route.params.subscribe((params: Params) => {
      this.calendarService.getEvents(+params.learnerId).subscribe(data => {
        let eventsToDisplay: CalendarEvent[] = [];
        let id = 0;
        data.forEach(session => {
          eventsToDisplay.push({
            id: id,
            start: session.start,
            end: session.end,
            title: ""
          })
          session.id = id;
          id++;
          this.allSessions.push(session);
        })
        eventsToDisplay.forEach(eventsToDisplay => {
          this.events = [
            ...this.events,
            eventsToDisplay
          ]
        })
      });

      this.calendarService.getLearnerInfo(+params.learnerId).subscribe(data => {
        this.learnerInfo = data;
      })
    });
  }

  onSessionClicked(action: string, event: CalendarEvent): void {
    const sessionEvents = this.allSessions.find(e => e.id === event.id).events;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = "800px"
    dialogConfig.data = this.segmentEvents(sessionEvents)

    this.dialog.open(SessionEventsComponent, dialogConfig);
  }

  private segmentEvents(events: LearningEvent[]): Array<Array<LearningEvent>> {
    let commonKcEvents = []
    let segmentedEvents = []
    for(let i = 1; i < events.length; i++) {
      if(!events[i+1]) {
        commonKcEvents.push(events[i])
        segmentedEvents.push(commonKcEvents)
        break;
      }
      if(events[i].knowledgeComponentId === events[i-1].knowledgeComponentId) {
        commonKcEvents.push(events[i-1]);
      } else {
        commonKcEvents.push(events[i-1]);
        segmentedEvents.push(commonKcEvents)
        commonKcEvents = []
      }
    }
    return segmentedEvents;
  }
}


