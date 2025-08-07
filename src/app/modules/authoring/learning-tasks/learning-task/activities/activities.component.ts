import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { Activity } from '../../model/activity';
import { isRequestStartedOrError, RequestStatus } from 'src/app/shared/generics/model/request-status';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnChanges {
  @Input() activities: Activity[];
  @Input() updateStatus: RequestStatus;

  activeActivity: Activity;
  
  @Output() activitySaved = new EventEmitter<Activity>();
  @Output() activityDeleted = new EventEmitter<number>();

  constructor(private dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(isRequestStartedOrError(changes.updateStatus)) return; // Triggers from parent when HTTP request starts
    if(this.activeActivity) {
      let correspondingActivity = this.activities.find(a => a.id === this.activeActivity.id || a.code === this.activeActivity.code);
      if(correspondingActivity) {
        this.activeActivity = correspondingActivity;
      } else {
        this.activeActivity = null;
      }
    }
  }

  view(activity: Activity) {
    this.activeActivity = activity;
  }

  createSubactivity(activity: Activity) {
    this.activeActivity = {
      parentId: activity.id,
      order: activity.subactivities.length + 1,
      code: '',
      name: '',
      guidance: '',
      submissionFormat: null,
      examples: [],
      llmAdditionalInstructions: ''
    };
  }

  reorder(activity: Activity, index: number, up: boolean) {
    const activityAtIndex = activity.subactivities[index];
    activity.subactivities.splice(index, 1);
    const moveFactor = up ? -1 : 1;
    activity.subactivities.splice(index + moveFactor, 0, activityAtIndex);
    
    activity.subactivities = activity.subactivities.map((subactivity: Activity, i: number) => {
      subactivity.order = i + 1;
      return subactivity;
    });
    this.save(activity);
  }

  save(activity: Activity) {
    this.activitySaved.emit(activity);
  }

  delete(activity: Activity) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (!result) return;

      const parentActivity = this.activities.find(a => a.id === activity.parentId);
      const index = parentActivity.subactivities.findIndex(subactivity => subactivity.id === activity.id);
      parentActivity.subactivities.splice(index, 1);
      
      parentActivity.subactivities.forEach((subactivity: Activity, idx: number) => {
        subactivity.order = idx + 1;
      });
      this.activeActivity = null;
      this.activityDeleted.emit(activity.id);
    });
  }
}