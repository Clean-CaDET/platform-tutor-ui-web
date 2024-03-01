import { Component, Input } from '@angular/core';
import { LearningTasksService } from './learning-tasks-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { LearningTaskFormComponent } from './learning-task-form/learning-task-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-learning-tasks',
  templateUrl: './learning-tasks.component.html',
  styleUrls: ['./learning-tasks.component.scss']
})
export class LearningTasksComponent  {

  @Input() learningTasks: any[];

  constructor(private route: ActivatedRoute, private learningTasksService: LearningTasksService, private dialog: MatDialog) { }
  
  add() {
    const dialogRef = this.dialog.open(LearningTaskFormComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      result.steps = [];
      const unitId = this.route.snapshot.queryParams['unit'];
      this.learningTasksService.create(unitId, result).subscribe(newLearningTask => {
        this.learningTasks = [...this.learningTasks, newLearningTask];
      });
    });
  }

  clone(template: any) {
    const dialogRef = this.dialog.open(LearningTaskFormComponent, {
      data: {
        template
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      const unitId = this.route.snapshot.queryParams['unit'];
      this.learningTasksService.clone(unitId, template.id,result).subscribe(newLearningTask => {
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
