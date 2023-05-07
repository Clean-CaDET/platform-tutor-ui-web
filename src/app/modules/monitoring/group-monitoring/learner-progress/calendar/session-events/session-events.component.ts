import {Component, Inject} from '@angular/core';
import {LearningEvent} from "../../../../../knowledge-analytics/model/learning-event.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {registerLocaleData} from "@angular/common";
import localeSr from "@angular/common/locales/sr-Latn";

@Component({
  selector: 'cc-session-events',
  templateUrl: './session-events.component.html',
  styleUrls: ['./session-events.component.scss']
})
export class SessionEventsComponent {
  events: Array<Array<LearningEvent>>;
  count: number;
  page = 1;
  pageSize = 50;
  displayedColumns: string[] = ['timeStamp', 'type', 'kcId', 'learnerId', 'specificData'];

  constructor(private dialogRef: MatDialogRef<SessionEventsComponent>,
              @Inject(MAT_DIALOG_DATA) data: Array<Array<LearningEvent>>) {
    registerLocaleData(localeSr, 'sr')
    this.events = data;
  }
}
