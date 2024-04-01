import { Component, OnInit } from '@angular/core';
import { LearningTasksService } from './learning-tasks-learning.service';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskProgressService } from './task-progress.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'cc-learning-task-view',
  templateUrl: './learning-task-view.component.html',
  styleUrls: ['./learning-task-view.component.scss']
})
export class LearningTaskViewComponent implements OnInit {

  task: any = {};
  steps: any[] = [];
  selectedStep: any = {};
  taskProgress: any = {};
  answerForm: FormGroup;
  selectedExample: any;
  showExample: boolean;
  videoUrl: SafeResourceUrl;

  constructor(private taskService: LearningTasksService, private progressService: TaskProgressService,
    private route: ActivatedRoute, private builder: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.createForm();
    this.setTask();
  }

  createForm() {
    this.answerForm = this.builder.group({
      answer: new FormControl(''),
    });
  }

  setTask() {
    this.route.params.subscribe((params: Params) => {
      this.taskService.get(+params.unitId, +params.ltId)
        .subscribe(task => {
          this.task = task;
          this.steps = task.steps.sort((a: { order: number; }, b: { order: number; }) => a.order > b.order ? 1 : -1);
          this.mapSubactivities(this.steps);
          this.steps = this.steps.filter((s: { parentId: any; }) => !s.parentId);
          this.selectedStep = this.steps[0];
          this.setTaskProgress();
        });
    });
  }

  mapSubactivities(activities: any[]) {
    for (const activity of activities) {
      activity.subactivities = [];
      for (const subactivity of activities) {
        if (subactivity.parentId === activity.id) {
          activity.subactivities.push(subactivity);
        }
      }
      activity.subactivities.sort((s1: { order: number; }, s2: { order: number; }) => s1.order - s2.order);
    }
  }

  setTaskProgress() {
    this.route.params.subscribe((params: Params) => {
      this.progressService.get(+params.unitId, +params.ltId)
        .subscribe(progress => {
          this.taskProgress = progress;
          this.viewStep(this.selectedStep);
          this.setInitialValues();
        });
    });
  }

  setInitialValues() {
    const regexPattern: RegExp = new RegExp(this.selectedStep.submissionFormat.validationRule);
    this.answerForm.get('answer').setValidators([Validators.required, Validators.pattern(regexPattern)]);
    let stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
    this.answerForm.get('answer').setValue(stepProgress.answer);
  }

  viewStep(step: any) {
    this.selectedStep = step;
    this.setInitialValues();
    this.route.params.subscribe((params: Params) => {
      this.progressService.viewStep(+params.unitId, this.task.id, this.taskProgress.id, step.id)
        .subscribe(progress => {
          this.taskProgress = progress;
          this.showExample = false;
        });
    });
  }

  isAnswered(step: any): boolean {
    if (this.taskProgress.stepProgresses) {
      let stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === step.id);
      return stepProgress.answer;
    }
  }

  submitAnswer() {
    let stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
    stepProgress.answer = this.answerForm.value.answer;
    this.route.params.subscribe((params: Params) => {
      this.progressService.submitAnswer(+params.unitId, this.task.id, this.taskProgress.id, stepProgress)
        .subscribe(progress => {
          this.taskProgress = progress;
        });
    });
  }

  showExamples() {
    this.showExample = true;
    this.selectedExample = this.selectedStep.examples[0];
    this.videoUrl = this.getSafeUrl(this.selectedExample.url);
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[index - 1];
    }
    this.videoUrl = this.getSafeUrl(this.selectedExample.url);
  }

  isLast() {
    let index = this.steps.indexOf(this.selectedStep);
    return index == this.steps.length - 1;
  }

  isFirst() {
    let index = this.steps.indexOf(this.selectedStep);
    return index == 0;
  }

  nextStep() {
    let index = this.steps.indexOf(this.selectedStep);
    this.selectedStep = this.steps[index + 1];
    this.showExample = false;
    this.selectedExample = null;
    if (this.selectedStep.examples)
      this.selectedExample = this.selectedStep.examples[0];
  }

  previosStep() {
    let index = this.steps.indexOf(this.selectedStep);
    this.selectedStep = this.steps[index - 1];
    this.showExample = false;
    this.selectedExample = null;
    if (this.selectedStep.examples)
      this.selectedExample = this.selectedStep.examples[0];
  }
}
