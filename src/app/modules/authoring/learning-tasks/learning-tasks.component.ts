import { Component, Input } from '@angular/core';
import { LearningTasksService } from './learning-tasks-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { LearningTaskFormComponent } from './learning-task-form/learning-task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { LearningTask } from './model/learning-task';

@Component({
  selector: 'cc-learning-tasks',
  templateUrl: './learning-tasks.component.html',
  styleUrls: ['./learning-tasks.component.scss']
})
export class LearningTasksComponent  {

  @Input() learningTasks: LearningTask[];

  constructor(private route: ActivatedRoute, private learningTasksService: LearningTasksService, private dialog: MatDialog) { }
  
  add(template: LearningTask) {
    let data = {};
    if(template) data = { data: {template}};

    const dialogRef = this.dialog.open(LearningTaskFormComponent, data);

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      const unitId = this.route.snapshot.queryParams['unit'];
      this.learningTasksService.create(unitId, result).subscribe(newLearningTask => {
        this.learningTasks = [...this.learningTasks, newLearningTask];
      });
    });
  }

  delete(learningTaskId: number) {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (result) {
        const unitId = this.route.snapshot.queryParams['unit'];
        this.learningTasksService.delete(unitId, learningTaskId).subscribe(() => {
          this.learningTasks = [...this.learningTasks.filter(a => a.id !== learningTaskId)];
        });
      }
    });
  }

  shorten(text: string): string {
    if(text.length <= 800) return text;
    return text.substring(0, 800) + "...";
  }
}
