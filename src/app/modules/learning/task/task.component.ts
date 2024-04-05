import { Component, OnInit } from '@angular/core';
import { TaskService } from './task.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskProgressService } from './task-progress.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningTask } from './model/learning-task';
import { Activity } from './model/activity';
import { ActivityExample } from './model/activity-example';
import { TaskProgress } from './model/task-progress';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'cc-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  showTask: boolean = true;

  task: LearningTask;
  steps: Activity[];
  selectedStep: Activity;
  taskProgress: TaskProgress;
  answerForm: FormGroup;
  selectedExample: ActivityExample;
  showExample: boolean;
  videoUrl: string;

  constructor(private taskService: TaskService, private progressService: TaskProgressService,
    private route: ActivatedRoute, private builder: FormBuilder) { }

  ngOnInit() {
    this.setTask();
  }

  setTask() {
    this.route.params.subscribe((params: Params) => {
      forkJoin([this.taskService.get(+params.unitId, +params.ltId), this.progressService.get(+params.unitId, +params.ltId)])
        .subscribe(([task, progress]) => {
          this.mapSubactivities(task.steps);
          this.task = task;
          this.steps = task.steps.filter(s => !s.parentId).sort((a, b) => a.order - b.order); // Check if we need steps
          this.taskProgress = progress;
          this.viewStep(this.findUnansweredStep() || this.steps[0]);
        });
    });
  }

  private mapSubactivities(activities: Activity[]) {
    for (const activity of activities) {
      activity.subactivities = [];
      for (const subactivity of activities) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1, s2) => s1.order - s2.order);
    }
  }

  private findUnansweredStep(): Activity {
    return this.steps.find(s => {
      const progress = this.taskProgress.stepProgresses.find(p => p.stepId === s.id);
      return !progress.answer;
    });
  }

  viewStep(step: any) {
    this.showExample = false;
    this.selectedStep = step;
    this.selectedStep.standards?.sort((a, b) => a.name > b.name ? 1 : -1);
    this.createForm();
    this.progressService.viewStep(this.task.unitId, this.task.id, this.taskProgress.id, step.id)
      .subscribe(progress => this.taskProgress = progress);
  }

  private createForm() {
    const regexPattern: RegExp = new RegExp(this.selectedStep.submissionFormat.validationRule);
    this.answerForm = this.builder.group({
      answer: new FormControl('', [Validators.required, Validators.pattern(regexPattern)])
    });
    let stepProgress = this.taskProgress.stepProgresses.find(s => s.stepId === this.selectedStep.id);
    this.answerForm.get('answer').setValue(stepProgress.answer);
  }

  isAnswered(step: any): boolean {
    if (!this.taskProgress.stepProgresses) return false;
    let stepProgress = this.taskProgress.stepProgresses.find(s => s.stepId === step.id);
    return !!stepProgress.answer;
  }

  submitAnswer() {
    let stepProgress = this.taskProgress.stepProgresses.find(s => s.stepId === this.selectedStep.id);
    stepProgress.answer = this.answerForm.value.answer;
    this.progressService.submitAnswer(this.task.unitId, this.task.id, this.taskProgress.id, stepProgress)
      .subscribe(progress => this.taskProgress = progress);
  }

  showExamples() {
    this.showExample = true;
    this.selectedExample = this.selectedStep.examples[0];
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[index - 1];
    }
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }

  isLast() {
    let index = this.steps.indexOf(this.selectedStep);
    return index == this.steps.length - 1;
  }

  isFirst() {
    let index = this.steps.indexOf(this.selectedStep);
    return index == 0;
  }

  changeStep(moveFactor: number) {
    let index = this.steps.indexOf(this.selectedStep);
    this.viewStep(this.steps[index + moveFactor])
  }
}
