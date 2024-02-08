import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenericSelectionFormComponent } from 'src/app/shared/generics/generic-selection-form/generic-selection-form.component';

@Component({
  selector: 'cc-activity-tree',
  templateUrl: './activity-tree.component.html',
  styleUrls: ['./activity-tree.component.scss']
})
export class ActivityTreeComponent implements OnChanges {

  @Input() activity: any;
  @Input() selectedActivity: any;
  @Input() subactivityOptions: any[];
  @Output() activitySelected = new EventEmitter<any>();
  @Output() deleteActivity = new EventEmitter<number>();
  @Output() editActivity = new EventEmitter<any>();
  options: any[];

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnChanges() {
    this.filterSubactivityOptions();
    this.activity.subactivities.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
  }

  filterSubactivityOptions() {
    const ancestors = this.findAncestors(this.activity.id);
    this.options = this.subactivityOptions.filter(activity => !ancestors.includes(activity.id));
    this.options = this.options.filter(activity => activity.id != this.activity.id);
    this.options = this.options.filter((option: { id: number; }) => {
      return !this.activity.subactivities.some((subactivity: { childId: any; }) => subactivity.childId === option.id);
    });
  }

  findAncestors(activityId: number) {
    const ancestors: any[] = [];

    const parentActivities = this.subactivityOptions.filter(act => act.subactivities.some((sub: { childId: any; }) => sub.childId === activityId));
    for (const parentActivity of parentActivities) {
      ancestors.push(parentActivity.id);
      const parentActivitiesToRemove = this.findAncestors(parentActivity.id);
      ancestors.push(...parentActivitiesToRemove);
    }

    return ancestors;
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
    this.filterSubactivityOptions();
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
    this.activity.subactivities.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
  }

  selectSubactivity() {
    const dialogRef = this.dialog.open(GenericSelectionFormComponent, {
      data: { items: this.options, presentationFunction: (activity: any) => activity.code + ": " + activity.name, label: "Izaberite podaktivnost" },
    });

    dialogRef.afterClosed().subscribe(subactivity => {
      if (subactivity) {
        subactivity.order = this.activity.subactivities.length + 1;
        subactivity.childId = subactivity.id;
        this.activity.subactivities.push(subactivity);
        this.filterSubactivityOptions();
        this.editActivity.emit(this.activity);
        this.reloadComponent();
      }
    });
  }

  reloadComponent() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]);
    });
  }
}