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
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cc-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  task: LearningTask;
  steps: Activity[];
  taskProgress: TaskProgress;

  selectedStep: Activity;
  answerForm: FormGroup;
  selectedExample: ActivityExample;
  videoUrl: string;
  
  courseId: number;
  selectedTab = 0;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private builder: FormBuilder,
    private taskService: TaskService,
    private progressService: TaskProgressService,
  ) { }

  ngOnInit() {
    this.setTask();
  }

  setTask() {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      forkJoin([this.taskService.get(+params.unitId, +params.ltId), this.progressService.get(+params.unitId, +params.ltId)])
        .subscribe(([task, progress]) => {
          this.mapSubactivities(task.steps);
          this.task = task;
          this.title.setTitle("Tutor - " + task.name);
          this.steps = task.steps.filter(s => !s.parentId).sort((a, b) => a.order - b.order); // Check if we need steps
          this.taskProgress = progress;
          if(this.steps.length) this.viewStep(this.findUnansweredStep() || this.steps[0]);
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
    this.selectedTab = 0;
    this.selectedStep = step;
    this.selectedStep.standards?.sort((a, b) => a.name > b.name ? 1 : -1);
    if(this.selectedStep.examples?.length > 0) {
      this.selectedExample = this.selectedStep.examples[0];
      this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
    }
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

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[0];
    }
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }
}
