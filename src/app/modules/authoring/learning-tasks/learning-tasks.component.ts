import { Component, Input } from '@angular/core';
import { LearningTasksService } from './learning-tasks-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { LearningTaskFormComponent } from './learning-task-form/learning-task-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'cc-learning-tasks',
  templateUrl: './learning-tasks.component.html',
  styleUrls: ['./learning-tasks.component.scss']
})
export class LearningTasksComponent  {

  @Input() learningTasks: any[];

  constructor(private route: ActivatedRoute, private learningTasksService: LearningTasksService, private dialog: MatDialog) { }

  create(learningTask: any) {
    const unitId = this.route.snapshot.queryParams['unit'];
    this.learningTasksService.create(unitId, learningTask).subscribe(newLearningTask => {
      this.learningTasks = [...this.learningTasks, newLearningTask];
    });
  }

  update(learningTask: any) {
    const unitId = this.route.snapshot.queryParams['unit'];
    this.learningTasksService.update(unitId, learningTask).subscribe(updatedLearningTask => {
      let learningTask = this.learningTasks.find(u => u.id === updatedLearningTask.id);
      learningTask.name = updatedLearningTask.name;
      learningTask.description = updatedLearningTask.description;
      learningTask.isTemplate = updatedLearningTask.isTemplate;
      learningTask.domainModel = updatedLearningTask.domainModel;
      learningTask.caseStudies = updatedLearningTask.caseStudies;
      learningTask.steps = updatedLearningTask.steps;
      learningTask.maxPoints = updatedLearningTask.maxPoints;
    });
  }

  add() {
    const dialogRef = this.dialog.open(LearningTaskFormComponent, {
      data: {
        learningTask:  {}
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      result.caseStudies = [];
      result.steps = [];
      this.create(result);
    });
  }

}
