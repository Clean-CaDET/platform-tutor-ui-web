import { Component, ChangeDetectionStrategy, inject, input, output, linkedSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Activity } from '../../../../learning/task/model/activity.model';
import { RequestStatus } from '../../../../../shared/model/request-status.model';
import { DeleteFormComponent } from '../../../../../shared/generics/delete-form/delete-form.component';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';

@Component({
  selector: 'cc-activities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule,
    ScrollingModule, ActivityDetailsComponent,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
})
export class ActivitiesComponent {
  private readonly dialog = inject(MatDialog);

  readonly activities = input.required<Activity[]>();
  readonly updateStatus = input(RequestStatus.None);
  readonly activitySaved = output<Activity>();
  readonly activityDeleted = output<number>();

  activeActivity = linkedSignal<{ activities: Activity[]; status: RequestStatus }, Activity | null>({
    source: () => ({ activities: this.activities(), status: this.updateStatus() }),
    computation: (source, previous) => {
      if (source.status === RequestStatus.Started || source.status === RequestStatus.Error)
        return previous?.value ?? null;
      const prev = previous?.value;
      if (prev) {
        return source.activities.find(a => a.id === prev.id || a.code === prev.code) ?? null;
      }
      return null;
    },
  });

  view(activity: Activity): void {
    this.activeActivity.set(activity);
  }

  createSubactivity(activity: Activity): void {
    this.activeActivity.set({
      parentId: activity.id,
      order: (activity.subactivities?.length ?? 0) + 1,
      code: '',
      name: '',
      guidance: '',
      submissionFormat: { type: '', guidelines: '' },
      examples: [],
    });
  }

  reorder(activity: Activity, index: number, up: boolean): void {
    const subs = [...(activity.subactivities ?? [])];
    const item = subs[index];
    subs.splice(index, 1);
    subs.splice(index + (up ? -1 : 1), 0, item);
    activity.subactivities = subs.map((s, i) => ({ ...s, order: i + 1 }));
    this.save(activity);
  }

  save(activity: Activity): void {
    this.activitySaved.emit(activity);
  }

  delete(activity: Activity): void {
    const dialogRef = this.dialog.open(DeleteFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const parent = this.activities().find(a => a.id === activity.parentId);
      if (parent) {
        parent.subactivities = (parent.subactivities ?? [])
          .filter(s => s.id !== activity.id)
          .map((s, idx) => ({ ...s, order: idx + 1 }));
      }
      this.activeActivity.set(null);
      this.activityDeleted.emit(activity.id!);
    });
  }
}
