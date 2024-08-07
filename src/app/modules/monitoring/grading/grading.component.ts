import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Unit } from '../model/unit.model';
import { GradingService } from './grading.service';
import { Learner } from '../model/learner.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningTask } from '../model/learning-task';
import { Step } from '../model/step';
import { TaskProgress } from '../model/task-progress';

@Component({
  selector: 'cc-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnChanges {
  @Input() units: Unit[];
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  selectedUnitId = 0;

  tasks: LearningTask[] = [];
  selectedTask: LearningTask;
  selectedStep: Step;
  
  gradingForm: FormGroup;

  constructor(private gradingService: GradingService, private builder: FormBuilder) { }

  ngOnChanges() {
    if (this.selectedUnitId) {
      this.getTaskProgresses();
    }
  }

  public getTasks() {
    this.gradingService.getTasks(this.selectedUnitId).subscribe(data => {
      if (!data?.length) return;
      this.tasks = data.sort((a, b) => a.order > b.order ? 1 : -1);
      this.tasks.forEach(task =>
        task.steps = task.steps
          .filter(s => !s.parentId)
          .sort((a, b) => a.order > b.order ? 1 : -1)
      );
      this.selectedTask = this.tasks[0];
      this.selectedStep = this.selectedTask.steps[0];
      this.getTaskProgresses();
    });
  }

  private getTaskProgresses() {
    this.gradingService.getTaskProgresses(this.selectedUnitId, this.selectedLearnerId).subscribe(data => {
      this.addStepProgressToTasks(data);
      if (!this.selectedStep) return;
      this.createForm();
    });
  }

  private addStepProgressToTasks(taskProgresses: TaskProgress[]) {
    this.tasks.forEach(task => {
      let progress = taskProgresses.find(p => p.learningTaskId === task.id);
      task.steps.forEach(step =>
        step.progress = progress?.stepProgresses?.find(s => s.stepId === step.id) ?? null);
    });
  }

  public isUnanswered(step: Step): boolean {
    if(!step.progress) return true;
    return !this.isAnswered(step) && !this.isGraded(step);
  }

  public isAnswered(step: Step): boolean {
    return step.progress?.status === 'Answered';
  }

  public isGraded(step: Step): boolean {
    return step.progress?.status === 'Graded';
  }

  public select(task: LearningTask, step: Step) {
    this.selectedTask = task;
    this.selectedStep = step;
    this.createForm();
  }

  private createForm() {
    this.gradingForm = this.builder.group({
      stepId: this.selectedStep.id,
      evaluations: this.createEvaluations(),
      comment: new FormControl(this.selectedStep.progress?.comment ?? '')
    });
  }

  private createEvaluations(): FormArray {
    let evaluationsArray = this.builder.array([]) as FormArray;
    this.selectedStep.standards.sort((a, b) => a.name > b.name ? 1 : -1);
    for (let standard of this.selectedStep.standards) {
      const evaluation = this.selectedStep.progress?.evaluations?.find(e => e.standardId === standard.id);
      evaluationsArray.push(this.builder.group({
        standardId: standard.id,
        points: new FormControl(evaluation?.points ?? 0, Validators.max(standard.maxPoints)),
        comment: new FormControl(evaluation?.comment ?? '')
      }));
    }
    return evaluationsArray;
  }

  get evaluations(): FormArray {
    return this.gradingForm.get('evaluations') as FormArray;
  }

  public submit() {
    this.gradingService.submitGrade(this.selectedUnitId, this.selectedStep.progress.taskProgressId, this.gradingForm.value)
      .subscribe(data => {
        this.selectedStep.progress = data.stepProgresses.find(stepProgress => stepProgress.stepId === this.selectedStep.id);
      });
  }

  public changeLearner(direction: number) {
    const currentLearner = this.learners.find(learner => learner.id == this.selectedLearnerId);
    const currentIndex = this.learners.indexOf(currentLearner);
    const newIndex = (currentIndex + direction + this.learners.length) % this.learners.length;
    this.selectedLearnerId = this.learners[newIndex].id;
    this.learnerChanged.emit(this.selectedLearnerId);
  }

  public changeStep(direction: number) {
    const currentStepIndex = this.selectedTask.steps.indexOf(this.selectedStep);
    if((direction === -1 && currentStepIndex > 0) ||
       (direction === 1 && currentStepIndex < this.selectedTask.steps.length - 1)) {
        this.selectedStep = this.selectedTask.steps[currentStepIndex + direction];
        this.createForm();
        return;
    }
    this.changeTask(direction);
  }

  private changeTask(direction: number) {
    const currentTaskIndex = this.tasks.indexOf(this.selectedTask);
    const newIndex = (currentTaskIndex + direction + this.tasks.length) % this.tasks.length;
    this.selectedTask = this.tasks[newIndex];
    this.selectedStep = direction === 1 ? this.selectedTask.steps[0] : this.selectedTask.steps[this.selectedTask.steps.length-1];
    this.createForm();
  }
}