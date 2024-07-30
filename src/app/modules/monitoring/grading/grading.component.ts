import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Unit } from '../model/unit.model';
import { GradingService } from './grading.service';
import { Learner } from '../model/learner.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'cc-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent {

  @Input() units: Unit[];
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  selectedUnitId = 0;
  tasks: any[] = [];
  taskProgress: any;
  stepProgress: any;
  selectedTask: any;
  selectedStep: any;
  @Output() learnerChanged = new EventEmitter<number>();
  stepProgressForm: FormGroup;
  pr: any;

  constructor(private gradingService: GradingService, private builder: FormBuilder, public sanitizer: DomSanitizer, private http: HttpClient) { }

  public getTasks() {
    this.gradingService.getTasks(this.selectedUnitId)
      .subscribe((data) => {
        this.tasks = data;
        this.selectedTask = this.tasks[0];
        this.selectedStep = this.selectedTask.steps[0];
        this.getTaskProgress();
      });
  }

  private getTaskProgress() {
    this.createForm();
    this.gradingService.getTaskProgress(this.selectedUnitId, this.selectedTask.id, this.selectedLearnerId)
      .subscribe((data) => {
        this.taskProgress = data;
        this.stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
        this.setValues();
      });
  }

  private createForm() {
    this.stepProgressForm = this.builder.group({
      stepId: 0,
      evaluations: this.builder.array([]),
      comment: new FormControl('')
    });

    if (this.selectedStep) {
      const evaluationsArray = this.builder.array([]) as FormArray;
      this.selectedStep.standards.sort((a: { name: number; }, b: { name: number; }) => a.name > b.name ? 1 : -1);
      for (let standard of this.selectedStep.standards) {
        evaluationsArray.push(this.builder.group({
          standardId: standard.id,
          points: new FormControl(0, Validators.max(standard.maxPoints)),
          comment: new FormControl('')
        }));
      }
      this.stepProgressForm.setControl('evaluations', evaluationsArray);
    }
    console.log(this.stepProgressForm.value);
  }

  private setValues() {
    if (this.stepProgress) {
      this.stepProgressForm.get('stepId')?.setValue(this.stepProgress.stepId);
      for (let evaluation of this.stepProgress.evaluations) {
        let evaluationForm = this.evaluations.controls.find((control: FormGroup) => {
          return control.get('standardId')?.value === evaluation.standardId;
        });
        evaluationForm.get('points')?.setValue(evaluation.points);
        evaluationForm.get('comment')?.setValue(evaluation.comment);
      }
      this.stepProgressForm.get('comment')?.setValue(this.stepProgress.comment);
    }
    console.log(this.stepProgressForm.value);
  }

  get evaluations(): FormArray {
    return this.stepProgressForm.get('evaluations') as FormArray;
  }

  public select(task: any, step: any) {
    this.selectedStep = step;
    if (this.selectedTask !== task) {
      this.selectedTask = task;
      this.getTaskProgress();
    } else {
      this.stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
      this.createForm();
      this.setValues();
    }
  }

  public submit() {
    console.log(this.stepProgressForm.value);
    this.gradingService.submitGrade(this.selectedUnitId, this.taskProgress.id, this.stepProgressForm.value)
      .subscribe((data) => {
        this.taskProgress = data;
        this.stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
        this.setValues();
      });
  }

  public changeLearner(direction: number) {
    let currentLearner = this.learners.find(learner => learner.id == this.selectedLearnerId);
    let currentIndex = this.learners.indexOf(currentLearner);
    let newIndex = (currentIndex + direction + this.learners.length) % this.learners.length;
    this.selectedLearnerId = this.learners[newIndex].id;
    this.getTaskProgress();
    this.learnerChanged.emit(this.selectedLearnerId);
  }

  public previousStep() {
    let previousStepIndex = this.selectedTask.steps.indexOf(this.selectedStep) - 1;
    if (previousStepIndex < 0) {
      let previousTaskIndex = this.tasks.indexOf(this.selectedTask) - 1;
      if (previousTaskIndex < 0) {
        previousTaskIndex = this.tasks.length - 1;
      }
      this.selectedTask = this.tasks[previousTaskIndex];
      previousStepIndex = this.selectedTask.steps.length - 1;
      this.getTaskProgress();
    }
    this.selectedStep = this.selectedTask.steps[previousStepIndex];
    this.stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
    this.createForm();
    this.setValues();
  }

  public nextStep() {
    let nextStepIndex = this.selectedTask.steps.indexOf(this.selectedStep) + 1;
    if (nextStepIndex >= this.selectedTask.steps.length) {
      let nextTaskIndex = this.tasks.indexOf(this.selectedTask) + 1;
      if (nextTaskIndex >= this.tasks.length) {
        nextTaskIndex = 0;
      }
      this.selectedTask = this.tasks[nextTaskIndex];
      nextStepIndex = 0;
      this.getTaskProgress();
    }
    this.selectedStep = this.selectedTask.steps[nextStepIndex];
    this.stepProgress = this.taskProgress.stepProgresses.find((s: { stepId: any; }) => s.stepId === this.selectedStep.id);
    this.createForm();
    this.setValues();
  }
}
