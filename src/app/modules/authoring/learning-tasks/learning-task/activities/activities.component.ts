import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { Activity } from '../../model/activity';

@Component({
  selector: 'cc-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnChanges {
  @Input() activities: Activity[];

  activeActivity: Activity;
  
  @Output() activitySaved = new EventEmitter<Activity>();
  @Output() activityDeleted = new EventEmitter<number>();

  constructor(private dialog: MatDialog) { }

  ngOnChanges(): void {
    if(this.activeActivity) {
      if(!this.activities.some(a => a.id === this.activeActivity.id)) {
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
      examples: []
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