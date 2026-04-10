import { Component, ChangeDetectionStrategy, inject, input, linkedSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rxResource } from '@angular/core/rxjs-interop';
import { ElaborationTask } from './model/elaboration-task.model';
import { ElaborationTaskAuthoringService } from './elaboration-task-authoring.service';
import { ElaborationTaskFormComponent } from './elaboration-task-form/elaboration-task-form.component';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-elaboration-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule],
  templateUrl: './elaboration-tasks.component.html',
})
export class ElaborationTasksComponent {
  private readonly taskService = inject(ElaborationTaskAuthoringService);
  private readonly dialog = inject(MatDialog);
  readonly unitId = input.required<number>();
  readonly courseId = input.required<number>();

  private readonly tasksResource = rxResource({
    params: () => ({ unitId: this.unitId() }),
    stream: ({ params }) => this.taskService.getByUnit(params.unitId),
    defaultValue: [],
  });

  tasks = linkedSignal(() => this.sortTasks(this.tasksResource.value()));

  add(): void {
    const tasks = this.tasks();
    const newOrder = tasks.length ? Math.max(...tasks.map(t => t.order)) + 1 : 1;
    const dialogRef = this.dialog.open(ElaborationTaskFormComponent, {
      minWidth: '500px',
      data: { task: null, courseId: this.courseId(), defaultOrder: newOrder },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.create(this.unitId(), result).subscribe({
        next: created => this.tasks.update(t => this.sortTasks([...t, created])),
        error: () => {},
      });
    });
  }

  edit(task: ElaborationTask): void {
    const dialogRef = this.dialog.open(ElaborationTaskFormComponent, {
      minWidth: '500px',
      data: { task, courseId: this.courseId() },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      result.id = task.id;
      this.taskService.update(this.unitId(), result).subscribe({
        next: updated => this.tasks.update(t => this.sortTasks(t.map(item => item.id === updated.id ? updated : item))),
        error: () => {},
      });
    });
  }

  delete(taskId: number): void {
    const dialogRef = this.dialog.open(DeleteFormComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.delete(this.unitId(), taskId).subscribe({
        next: () => this.tasks.update(t => t.filter(item => item.id !== taskId)),
        error: () => {},
      });
    });
  }

  private sortTasks(tasks: ElaborationTask[]): ElaborationTask[] {
    return [...tasks].sort((a, b) => a.order - b.order);
  }
}
