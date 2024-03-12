import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { Activity } from '../../model/activity';

@Component({
  selector: 'cc-activity-tree',
  templateUrl: './activity-tree.component.html',
  styleUrls: ['./activity-tree.component.scss']
})
export class ActivityTreeComponent {

  @Input() activity: Activity;
  @Input() parentActivity: Activity;
  @Input() selectedActivity: Activity;
  @Output() activitySelected = new EventEmitter<Activity>();
  @Output() addSubactivity = new EventEmitter<Activity>();
  @Output() editActivity = new EventEmitter<Activity>();
  @Output() deleteActivity = new EventEmitter<number>();
  addSubactivityMode: boolean;
  addSubactivityClicked: boolean;

  constructor(private dialog: MatDialog) { }

  select(activity: any) {
    if (!this.addSubactivityClicked) {
      this.addSubactivityMode = false;
      this.selectedActivity = activity;
      this.activitySelected.emit(activity);
    }
    this.addSubactivityClicked = false;
  }

  createSubactivity() {
    this.addSubactivityClicked = true;
    this.addSubactivityMode = true;
    this.addSubactivity.emit(this.activity);
    let newSubactivity: any = {
      parentId: this.activity.id,
      order: this.activity.subactivities.length + 1,
      code: '',
      name: '',
      description: '',
      examples: []
    }
    this.activitySelected.emit(newSubactivity);
  }

  up(index: number) {
    const activityAtIndex = this.activity.subactivities[index];
    this.activity.subactivities.splice(index, 1);
    this.activity.subactivities.splice(index - 1, 0, activityAtIndex);
    this.reorderSubactivities();
  }


  down(index: number) {
    const activityAtIndex = this.activity.subactivities[index];
    this.activity.subactivities.splice(index, 1);
    this.activity.subactivities.splice(index + 1, 0, activityAtIndex);
    this.reorderSubactivities();
  }

  reorderSubactivities() {
    const mappedActivities = this.activity.subactivities.map((subactivity: Activity, i: number) => {
      subactivity.order = i + 1;
      return subactivity;
    });
    this.activity.subactivities = mappedActivities;
    this.activity.subactivities.sort((s1, s2) => s1.order - s2.order);
    for (let activity of this.activity.subactivities) {
      this.editActivity.emit(activity);
    }
  }

  delete(activityId: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteActivity.emit(activityId);
      }
    });
  }
}