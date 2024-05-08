import { Component, OnDestroy, OnInit } from '@angular/core';
import { LearningTask } from '../model/learning-task';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LearningTasksService } from '../learning-tasks-authoring.service';
import { Subscription } from 'rxjs';
import { Activity } from '../model/activity';
import { MatDialog } from '@angular/material/dialog';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  steps: Activity[];
  subactivities: Activity[];

  constructor(private taskService: LearningTasksService, private route: ActivatedRoute,
    private router: Router, private dialog: MatDialog, private errorsBar: MatSnackBar) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.unitId = +params.unitId;
      this.taskService.get(this.unitId, +params.ltId).subscribe(task => {
        this.setupTaskAndActivities(task);
      });
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  private setupTaskAndActivities(task: LearningTask) {
    this.task = this.linkSubactivities(task);
    this.steps = task.steps.filter(s => !s.parentId).sort((a, b) => a['order'] > b['order'] ? 1 : -1);
    if (this.selectedStep) {
      this.selectStep(this.task.steps.find(s => s.id === this.selectedStep.id || s.code === this.selectedStep.code), this.mode);
    }
  }

  private linkSubactivities(task: LearningTask): LearningTask {
    for (const activity of task.steps) {
      activity.subactivities = [];

      for (const subactivity of task.steps) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
    }
    return task;
  }

  private selectStep(step: Activity, mode: string) {
    this.selectedStep = step;
    this.mode = mode;
    if (this.mode === 'subactivities') {
      this.subactivities = [this.selectedStep, ...this.task.steps.filter(s => this.isDescendant(s, this.selectedStep.id))];
    }
  }

  private isDescendant(step: Activity, parentId: number): boolean {
    if (!step || !parentId) return false;
    if (step.parentId === parentId) return true;
    return this.isDescendant(this.task.steps.find(s => s.id === step.parentId), parentId);
  }

  openTask(): void {
    this.selectStep(null, 'task');
    this.router.navigate([], { queryParams: { mode: this.mode }});
  }

  addStep(): void {
    let newStep: Activity = {
      name: '',
      code: '',
      guidance: '',
      order: this.getOrder(),
      submissionFormat: { type: 'Link', validationRule: '', guidelines: '' },
      examples: [],
      standards: []
    };
    this.selectStep(newStep, 'guidance');
  }

  private getOrder(): number {
    if (!this.task.steps?.length) return 1;
    return Math.max(...this.task.steps.filter(s => !s.parentId).map(s => s.order)) + 1;
  }

  setStepAndParams(step: Activity, mode: string): void {
    this.selectStep(step, mode);
    this.router.navigate([], {
      queryParams: { step: this.selectedStep.id, mode: this.mode },
      queryParamsHandling: 'merge'
    });
  }

  createOrUpdateStep(step: Activity) {
    let task = JSON.parse(JSON.stringify(this.task));
    if (step.id) {
      task.steps = this.task.steps.map(s => s.id === step.id ? step : s);
    } else {
      if(!step.parentId) this.selectedStep = step;
      task.steps.push(step);
    }
    this.updateTask(task);
  }

  reorder(step: Activity, index: number, up: boolean) {
    const swappedStepIndex = up ? index-1 : index+1;
    const swappedStep = this.steps[swappedStepIndex];
    [step.order, swappedStep.order] = [swappedStep.order, step.order];
    this.updateTask(this.task);
  }

  deleteStep(id: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (!result) return;
      let orderCounter = 1;
      this.task.steps.filter(s => s.id !== id && !s.parentId).forEach(s => {
        s.order = orderCounter;
        orderCounter++;
      });
      this.deleteActivity(id);
    });
  }

  deleteActivity(activityId: number) {
    if(this.selectedStep?.id === activityId) this.selectedStep = null;
    this.task.steps = this.task.steps.filter(s => s.id !== activityId);
    this.task.steps = this.task.steps.filter(s => !this.isDescendant(s, activityId));
    this.updateTask(this.task);
  }

  updateTask(task: LearningTask) {
    this.taskService.update(this.unitId, task)
      .subscribe({
        next: updatedTask => {
          this.setupTaskAndActivities(updatedTask);
        },
        error: (error) => {
          if (error.error.status === 409)
            this.errorsBar.open('Greška: Aktivnost sa datim kodom već postoji u zadatku. Izmeni kod.', "OK", { horizontalPosition: 'right', verticalPosition: 'top' });
        }
      });
  }
}
