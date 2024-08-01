import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Unit } from '../model/unit.model';
import { GradingService } from './grading.service';
import { Learner } from '../model/learner.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningTask } from '../model/learning-task';
import { Step } from '../model/step';
import { TaskProgress } from '../model/task-progress';
import { StepProgress } from '../model/step-progress';

@Component({
  selector: 'cc-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnChanges {

  @Input() units: Unit[];
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  selectedUnitId = 0;

  tasks: LearningTask[] = [];
  selectedTask: LearningTask;
  selectedStep: Step;
  taskProgresses: TaskProgress[] = [];
  selectedTaskProgress: TaskProgress;
  selectedStepProgress: StepProgress;
  
  @Output() learnerChanged = new EventEmitter<number>();
  stepProgressForm: FormGroup;

  constructor(private gradingService: GradingService, private builder: FormBuilder) { }

  ngOnChanges() {
    if (this.selectedUnitId) {
      this.selectedTaskProgress = null;
      this.selectedStepProgress = null;
      this.getTaskProgresses();
    }
  }

  public getTasks() {
    this.gradingService.getTasks(this.selectedUnitId)
      .subscribe((data) => {
        this.tasks = data;
        this.taskProgresses = [];
        this.selectedTaskProgress = null;
        this.selectedStepProgress = null;
        if (this.tasks.length == 0)
          return;
        this.selectedTask = this.tasks[0];
        this.selectedStep = this.selectedTask.steps[0];
        this.getTaskProgresses();
      });
  }

  private getTaskProgresses() {
    this.gradingService.getTaskProgresses(this.selectedUnitId, this.selectedLearnerId)
      .subscribe((data) => {
        this.taskProgresses = data;
        if (this.taskProgresses.length == 0) {
          return;
        }
        this.mapTaskProgresses();
        this.findNextStep();
        if (this.selectedTaskProgress != null) {
          this.selectedTask = this.tasks.find(t => t.id == this.selectedTaskProgress.learningTaskId);
          this.selectedStep = this.selectedTask.steps.find(s => s.id == this.selectedStepProgress.stepId);
          this.createForm();
          this.setValues();
        }
      });
  }

  private mapTaskProgresses() {
    this.tasks.forEach(task => {
      let progress = this.taskProgresses.find(p => p.learningTaskId === task.id);
      if (progress) {
        progress.order = task.order;
        progress.name = task.name;
        task.steps.forEach(step => {
          let stepProgress = progress.stepProgresses.find(s => s.stepId === step.id);
          stepProgress.order = step.order;
          stepProgress.name = step.name;
        })
        progress.stepProgresses.sort((a, b) => a.order > b.order ? 1 : -1);
      }
    });
    this.taskProgresses.sort((a, b) => a.order > b.order ? 1 : -1);
  }

  private findNextStep() {
    this.selectedTaskProgress = this.taskProgresses.find(p => p.learningTaskId == this.selectedTask.id);
    if (this.selectedTaskProgress != null) {
      this.selectedStepProgress = this.selectedTaskProgress.stepProgresses.find(s => s.stepId === this.selectedStep.id);
    } else {
      this.selectedTaskProgress = this.taskProgresses[0];
      this.selectedStepProgress = this.selectedTaskProgress.stepProgresses[0];
    }
    this.findAnsweredOrGradedStep();
  }

  private findAnsweredOrGradedStep() {
    let currentStepProgressId = this.selectedStepProgress.id;
    while (!this.isAnswered(this.selectedStepProgress) && !this.isGraded(this.selectedStepProgress)) {
      this.nextStepProgress();
      if (this.selectedStepProgress.id == currentStepProgressId) {
        this.selectedTaskProgress = null;
        this.selectedStepProgress = null;
        return;
      }
    }
    this.selectedTask = this.tasks.find(t => t.id == this.selectedTaskProgress.learningTaskId);
    this.selectedStep = this.selectedTask.steps.find(s => s.id == this.selectedStepProgress.stepId);
    this.createForm();
    this.setValues();
  }

  private nextStepProgress() {
    let nextStepProgressIndex = this.selectedTaskProgress.stepProgresses.indexOf(this.selectedStepProgress) + 1;
    if (nextStepProgressIndex >= this.selectedTaskProgress.stepProgresses.length) {
      let nextTaskProgressIndex = this.taskProgresses.indexOf(this.selectedTaskProgress) + 1;
      if (nextTaskProgressIndex >= this.taskProgresses.length) {
        nextTaskProgressIndex = 0;
      }
      this.selectedTaskProgress = this.taskProgresses[nextTaskProgressIndex];
      nextStepProgressIndex = 0;
    }
    this.selectedStepProgress = this.selectedTaskProgress.stepProgresses[nextStepProgressIndex];
  }

  private createForm() {
    this.stepProgressForm = this.builder.group({
      stepId: 0,
      evaluations: this.builder.array([]),
      comment: new FormControl('')
    });

    if (this.selectedStep) {
      this.createEvaluations();
    }
  }

  private createEvaluations() {
    let evaluationsArray = this.builder.array([]) as FormArray;
    this.selectedStep.standards.sort((a, b) => a.name > b.name ? 1 : -1);
    for (let standard of this.selectedStep.standards) {
      evaluationsArray.push(this.builder.group({
        standardId: standard.id,
        points: new FormControl(0, Validators.max(standard.maxPoints)),
        comment: new FormControl('')
      }));
    }
    this.stepProgressForm.setControl('evaluations', evaluationsArray);
  }

  private setValues() {
    if (this.selectedStepProgress) {
      this.stepProgressForm.get('stepId')?.setValue(this.selectedStepProgress.stepId);
      for (let evaluation of this.selectedStepProgress.evaluations) {
        let evaluationForm = this.evaluations.controls.find((control: FormGroup) => {
          return control.get('standardId')?.value === evaluation.standardId;
        });
        evaluationForm.get('points')?.setValue(evaluation.points);
        evaluationForm.get('comment')?.setValue(evaluation.comment);
      }
      this.stepProgressForm.get('comment')?.setValue(this.selectedStepProgress.comment);
    }
  }

  get evaluations(): FormArray {
    return this.stepProgressForm.get('evaluations') as FormArray;
  }

  public select(taskProgress: any, stepProgress: any) {
    this.selectedTaskProgress = taskProgress;
    this.selectedStepProgress = stepProgress;
    this.selectedTask = this.tasks.find(t => t.id == taskProgress.learningTaskId);
    this.selectedStep = this.selectedTask.steps.find(s => s.id == stepProgress.stepId);
    this.createForm();
    this.setValues();
  }

  public isGraded(stepProgress: any) {
    return stepProgress.status == 'Graded';
  }

  public isAnswered(stepProgress: any) {
    return stepProgress.status == 'Answered';
  }

  public submit() {
    console.log(this.stepProgressForm.value);
    this.gradingService.submitGrade(this.selectedUnitId, this.selectedTaskProgress.id, this.stepProgressForm.value)
      .subscribe((data) => {
        let newTaskProgress = data;
        let oldTaskProgress = this.taskProgresses.find(p => p.id === this.selectedTaskProgress.id);
        let index = this.taskProgresses.indexOf(oldTaskProgress);
        this.taskProgresses.splice(index, 1, newTaskProgress);
        this.taskProgresses = [...this.taskProgresses]; // to update list because of *cdkVirtualFor
        this.mapTaskProgresses();
        this.selectedTaskProgress = this.taskProgresses.find(p => p.id === newTaskProgress.id);
        this.selectedStepProgress = this.selectedTaskProgress.stepProgresses.find(s => s.stepId === this.selectedStep.id);
        this.setValues();
      });
  }

  public changeLearner(direction: number) {
    let currentLearner = this.learners.find(learner => learner.id == this.selectedLearnerId);
    let currentIndex = this.learners.indexOf(currentLearner);
    let newIndex = (currentIndex + direction + this.learners.length) % this.learners.length;
    this.selectedLearnerId = this.learners[newIndex].id;
    this.selectedTaskProgress = null;
    this.selectedStepProgress = null;
    this.learnerChanged.emit(this.selectedLearnerId);
  }

  public previousStep() {
    do {
      this.previousStepProgress();
    } while (!this.isAnswered(this.selectedStepProgress) && !this.isGraded(this.selectedStepProgress));
    this.selectedTask = this.tasks.find(t => t.id == this.selectedTaskProgress.learningTaskId);
    this.selectedStep = this.selectedTask.steps.find(s => s.id == this.selectedStepProgress.stepId);
    this.createForm();
    this.setValues();
  }

  private previousStepProgress() {
    let previousStepProgressIndex = this.selectedTaskProgress.stepProgresses.indexOf(this.selectedStepProgress) - 1;
    if (previousStepProgressIndex < 0) {
      let previoustTaskProgressIndex = this.taskProgresses.indexOf(this.selectedTaskProgress) - 1;
      if (previoustTaskProgressIndex < 0) {
        previoustTaskProgressIndex = this.taskProgresses.length - 1;
      }
      this.selectedTaskProgress = this.taskProgresses[previoustTaskProgressIndex];
      previousStepProgressIndex = this.selectedTaskProgress.stepProgresses.length - 1;
    }
    this.selectedStepProgress = this.selectedTaskProgress.stepProgresses[previousStepProgressIndex];
  }

  public nextStep() {
    do {
      this.nextStepProgress();
    } while (!this.isAnswered(this.selectedStepProgress) && !this.isGraded(this.selectedStepProgress));
    this.selectedTask = this.tasks.find(t => t.id == this.selectedTaskProgress.learningTaskId);
    this.selectedStep = this.selectedTask.steps.find(s => s.id == this.selectedStepProgress.stepId);
    this.createForm();
    this.setValues();
  }
}
