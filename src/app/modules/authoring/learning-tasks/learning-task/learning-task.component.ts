import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearningTask } from '../model/learning-task';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningTasksService } from '../learning-tasks-authoring.service';
import { Subscription } from 'rxjs';
import { Activity } from '../model/activity';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';

@Component({
  selector: 'cc-learning-task',
  templateUrl: './learning-task.component.html',
  styleUrls: ['./learning-task.component.scss']
})
export class LearningTaskComponent implements OnInit, OnDestroy {
  courseId: number;
  unitId: number;
  routeSubscription: Subscription;
  
  task: LearningTask;
  mode: string = 'task';
  selectedStep: Activity;

  constructor(private taskService: LearningTasksService, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.unitId = +params.unitId;
      this.taskService.get(this.unitId, +params.ltId)
        .subscribe(task => this.task = task);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  openTask(): void {
    this.mode = 'task';
    this.selectedStep = null;
  }

  addStep(): void {
    let newStep: Activity = {
      name: '',
      code: '',
      guidance: '',
      order: this.getOrder(),
      submissionFormat: {guidelines: '', validationRule: ''},
      examples: [],
      standards: []
    };
    this.showStep(newStep, true);
  }

  private getOrder(): number {
    if(!this.task.steps?.length) return 1;
    return Math.max(...this.task.steps.map(s => s.order)) + 1;
  }

  showStep(step: Activity, guidance: boolean): void {
    this.selectedStep = step;
    this.mode = guidance ? 'guidance' : 'subactivities';
  }

  createOrUpdateStep(step: Activity) {
    if(step.id) {
      this.task.steps = this.task.steps.map(s => s.id === step.id ? step : s);
    } else {
      step.order = this.getOrder();
      this.task.steps.push(step);
    }
    this.updateTask();
  }

  deleteStep(id: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;

      this.task.steps = this.task.steps.filter(s => s.id !== id);
      this.updateTask();
    });
  }

  private updateTask() {
    this.taskService.update(this.unitId, this.task)
      .subscribe(task => {
        this.task = task;
        this.task.steps = this.task.steps.sort((a, b) => a['order'] > b['order'] ? 1 : -1);
      });
  }
}
