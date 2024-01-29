import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GenericSelectionFormComponent } from 'src/app/shared/generics/generic-selection-form/generic-selection-form.component';

@Component({
  selector: 'cc-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnChanges {

  @Input() activity: any;
  @Input() selectedActivity: any;
  @Input() subactivityOptions: any;
  @Output() activitySelected = new EventEmitter<any>();
  @Output() deleteActivity = new EventEmitter<number>();
  @Output() editActivity = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { }
  
  ngOnChanges() {
    this.filterSubactivityOptions();
  }

  filterSubactivityOptions() {
    this.subactivityOptions = this.subactivityOptions.filter((option: { id: number; }) => {
      return !this.activity.subactivities.some((subactivity: { childId: any; }) => subactivity.childId === option.id);
    });
    this.subactivityOptions = this.subactivityOptions.filter((option: {id: number;}) => {
      return option.id !== this.activity.id;
    });
  }

  select(activity: any) {
    this.activitySelected.emit(activity);
  }

  delete(activityId: number) {
    this.deleteActivity.emit(activityId);
  }

  remove(index: number) {
    this.activity.subactivities.splice(index, 1);
    this.reorderSubactivities();
    this.editActivity.emit(this.activity);
  }

  up(index: number) {
    const activityAtIndex = this.activity.subactivities[index];
    this.activity.subactivities.splice(index, 1);
    this.activity.subactivities.splice(index - 1, 0, activityAtIndex);
    this.reorderSubactivities();
    this.editActivity.emit(this.activity);
  }

  down(index: number) {
    const activityAtIndex = this.activity.subactivities[index];
    this.activity.subactivities.splice(index, 1);
    this.activity.subactivities.splice(index + 1, 0, activityAtIndex);
    this.reorderSubactivities();
    this.editActivity.emit(this.activity);
  }

  reorderSubactivities() {
    const mappedActivities = this.activity.subactivities.map((subactivity: { order: any; }, i: number) => {
      subactivity.order = i + 1;
      return subactivity;
    });
    this.activity.subactivities = mappedActivities;
  }

  selectSubactivity() {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: { items: this.subactivityOptions, presentationFunction: (activity: any) => activity.code + ": " + activity.name, label: "Izaberite podaktivnost" },
    });

    dialogRef.afterClosed().subscribe(subactivity => {
      if (subactivity) {
        subactivity.order = this.activity.subactivities.length + 1;
        subactivity.childId = subactivity.id;
        this.activity.subactivities.push(subactivity);
        this.editActivity.emit(this.activity);
      }
    });
  }
}