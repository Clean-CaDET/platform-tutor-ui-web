import { Component, ChangeDetectionStrategy, inject, input, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LearningTask } from '../../learning/task/model/learning-task.model';
import { Unit } from '../model/unit.model';
import { LearningTasksAuthoringService } from './learning-tasks-authoring.service';
import { TaskCloningFormComponent } from './task-cloning-form/task-cloning-form.component';
import { TaskMovingFormComponent } from './task-moving-form/task-moving-form.component';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';

@Component({
  selector: 'cc-learning-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule,
    RouterLink, CcMarkdownComponent,
  ],
  templateUrl: './learning-tasks.component.html',
})
export class LearningTasksComponent {
  private readonly taskService = inject(LearningTasksAuthoringService);
  private readonly dialog = inject(MatDialog);
  readonly units = input.required<Unit[]>();
  readonly unitId = input.required<number>();

  learningTasks = signal<LearningTask[]>([]);

  constructor() {
    effect(() => {
      const unitId = this.unitId();
      this.loadTasks(unitId);
    });
  }

  private loadTasks(unitId: number): void {
    this.taskService.getByUnit(unitId).subscribe(tasks => {
      this.learningTasks.set(this.sortTasks(tasks));
    });
  }

  add(template: LearningTask | null): void {
    const tasks = this.learningTasks();
    const newOrder = tasks.length ? Math.max(...tasks.map(t => t.order!)) + 1 : 1;
    const data = template ? { template, newOrder } : { newOrder };

    const dialogRef = this.dialog.open(TaskCloningFormComponent, {
      minWidth: "900px",
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (template) {
        result.id = template.id;
        this.taskService.clone(this.unitId(), result).subscribe({
          next: newTask => this.learningTasks.update(t => this.sortTasks([...t, newTask])),
          error: () => {},
        });
      } else {
        this.taskService.create(this.unitId(), result).subscribe({
          next: newTask => this.learningTasks.update(t => this.sortTasks([...t, newTask])),
          error: () => {},
        });
      }
    });
  }

  move(task: LearningTask): void {
    const dialogRef = this.dialog.open(TaskMovingFormComponent, {
      data: { units: this.units(), taskName: task.name },
      minHeight: '220px', minWidth: '900px',
    });
    dialogRef.afterClosed().subscribe(destinationUnitId => {
      if (!destinationUnitId || task.unitId === destinationUnitId) return;
      this.taskService.move(task.unitId!, task.id!, destinationUnitId).subscribe({
        next: () => this.learningTasks.update(t => t.filter(a => a.id !== task.id)),
        error: () => {},
      });
    });
  }

  delete(taskId: number): void {
    const dialogRef = this.dialog.open(DeleteFormComponent, { data: { secureDelete: true } });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.delete(this.unitId(), taskId).subscribe({
        next: () => this.learningTasks.update(t => t.filter(a => a.id !== taskId)),
        error: () => {},
      });
    });
  }

  getMainSteps(task: LearningTask): { name: string; maxPoints?: number }[] {
    return (task.steps ?? []).filter(s => !s.parentId).sort((a, b) => a.order - b.order);
  }

  shorten(text: string | undefined): string {
    if (!text) return '';
    if (text.length <= 800) return text;
    return text.substring(0, 800) + '...';
  }

  private sortTasks(tasks: LearningTask[]): LearningTask[] {
    return [...tasks].sort((a, b) => {
      if (a.isTemplate !== b.isTemplate) return a.isTemplate ? -1 : 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }
}
