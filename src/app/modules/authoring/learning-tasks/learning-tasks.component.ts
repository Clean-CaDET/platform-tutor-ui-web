import { Component, Input } from '@angular/core';
import { LearningTasksService } from './learning-tasks-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { TaskCloningFormComponent } from './task-cloning-form/task-cloning-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { LearningTask } from './model/learning-task';
import { TaskMovingFormComponent } from './task-moving-form/task-moving-form.component';
import { Unit } from '../../learning/model/unit.model';

@Component({
  selector: 'cc-learning-tasks',
  templateUrl: './learning-tasks.component.html',
  styleUrls: ['./learning-tasks.component.scss']
})
export class LearningTasksComponent {
  @Input() learningTasks: LearningTask[];
  @Input() units: Unit[];

  constructor(private route: ActivatedRoute, private taskService: LearningTasksService, private dialog: MatDialog) { }

  add(template: LearningTask) {
    let data = {};
    const newOrder = this.learningTasks ? Math.max(...this.learningTasks.map(t => t.order)) + 1 : 1;
    if (template) data = { data: { template, newOrder } };
    else data = { data: { newOrder } };

    const dialogRef = this.dialog.open(TaskCloningFormComponent, data);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const unitId = this.route.snapshot.queryParams['unit'];
      if (template) {
        result.id = template.id;
        this.clone(result, unitId);
      } else {
        this.create(unitId, result);
      }
    });
  }

  private clone(result: any, unitId: any) {
    this.taskService.clone(unitId, result).subscribe(newLearningTask => {
      this.learningTasks = [...this.learningTasks, newLearningTask];
      this.sortTasks();
    });
  }
  
  sortTasks() {
    this.learningTasks.sort((a, b) => {
      if (a.isTemplate !== b.isTemplate) {
          return a.isTemplate ? -1 : 1;
      }
      return a.order - b.order;
    });
  }

  private create(unitId: any, result: any) {
    this.taskService.create(unitId, result).subscribe(newLearningTask => {
      this.learningTasks = [...this.learningTasks, newLearningTask];
      this.sortTasks();
    });
  }

  move(learningTask: LearningTask): void {
    let diagRef = this.dialog.open(TaskMovingFormComponent, { data: {
      units: this.units,
      taskName: learningTask.name
    }, height: '210px', width: '500px'});

    diagRef.afterClosed().subscribe(destinationUnitId => {
      if(!destinationUnitId || learningTask.unitId === destinationUnitId) return;
      
      this.taskService.move(learningTask.unitId, learningTask.id, destinationUnitId).subscribe(() => {
        this.learningTasks = [...this.learningTasks.filter(a => a.id !== learningTask.id)];
      });
    });
  }

  delete(learningTaskId: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (result) {
        const unitId = this.route.snapshot.queryParams['unit'];
        this.taskService.delete(unitId, learningTaskId).subscribe(() => {
          this.learningTasks = [...this.learningTasks.filter(a => a.id !== learningTaskId)];
        });
      }
    });
  }

  getMainSteps(learningTask: LearningTask) {
    return learningTask.steps.filter(s => !s.parentId).sort((a, b) => a.order - b.order);
  }

  shorten(text: string): string {
    if (text.length <= 800) return text;
    return text.substring(0, 800) + "...";
  }
}
