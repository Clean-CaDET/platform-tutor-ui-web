import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Unit } from '../model/unit.model';
import { GradingService } from './grading.service';
import { Learner } from '../model/learner.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningTask } from './model/learning-task';
import { Step } from './model/step';
import { TaskProgress } from './model/task-progress';
import { MatSnackBar } from '@angular/material/snack-bar';
import { gradingInstruction } from './model/grading.constants';

@Component({
  selector: 'cc-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnChanges {
  @Input() courseId: number;
  @Input() selectedLearnerId: number;
  @Input() learners: Learner[];
  @Output() learnerChanged = new EventEmitter<number>();
  @Output() gradesChanged = new EventEmitter<TaskProgress[]>();
  selectedUnitId = 0;
  @Input() selectedDate: Date;

  units: Unit[] = [];
  tasks: LearningTask[] = [];
  selectedTask: LearningTask;
  selectedStep: Step;
  
  gradingForm: FormGroup;
  structuredFormShown: boolean;
  systemPrompt: string = gradingInstruction;

  constructor(private gradingService: GradingService, private builder: FormBuilder, private clipboard: Clipboard, private snackBar: MatSnackBar) { }
 
  ngOnChanges(changes: SimpleChanges): void {
    if(!changes) return;
    if(this.changeOccured(changes.learners) || this.changeOccured(changes.selectedDate)) {
      this.getUnits();
    }
    if(this.changeOccured(changes.selectedLearnerId)) {
      if (this.selectedUnitId) {
        this.getTaskProgresses();
      }
    }
  }

  private changeOccured(changedField: { currentValue: any, previousValue: any }) {
    return changedField && changedField.currentValue && changedField.currentValue !== changedField.previousValue;
  }

  private getUnits() {
    if(!this.selectedDate) return;
    this.gradingService.getWeeklyUnits(this.courseId, this.selectedLearnerId, this.selectedDate).subscribe(units => {
      this.units = units.sort((a, b) => a.order - b.order);
      if(this.selectedUnitId && !this.units.some(u => u.id === this.selectedUnitId)) {
        this.selectedUnitId = 0;
        this.tasks = [];
        this.selectedStep = null;
      }
      this.updateGradeSummaries();
    });
  }

  private updateGradeSummaries() {
    this.gradingService.getGroupSummaries(this.units.map(u => u.id), this.learners.map(l => l.id)).subscribe(summaries => {
      this.gradesChanged.emit(summaries);
    });
  }

  public getTasks() {
    this.tasks = [];
    this.selectedStep = null;
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
      task.steps.forEach(step => {
        step.progress = progress?.stepProgresses?.find(s => s.stepId === step.id) ?? null;
        if (step.progress) {
          step.progress.taskProgressId = progress.id;
        }
      });
    });
  }

  public isUnanswered(step: Step): boolean {
    if(!step.progress) return true;
    return step.progress.status !== 'Answered' && step.progress.status !== 'Graded';
  }

  public select(task: LearningTask, step: Step) {
    this.selectedTask = task;
    this.selectedStep = step;
    this.createForm();
  }

  private createForm() {
    this.structuredFormShown = true;
    this.gradingForm = this.builder.group({
      stepId: this.selectedStep.id,
      evaluations: this.createEvaluations(),
      comment: new FormControl(this.selectedStep.progress?.comment ?? ''),
      rawEvaluation: new FormControl(''),
    });
  }

  private createEvaluations(): FormArray {
    let evaluationsArray = this.builder.array([]) as FormArray;
    this.selectedStep.standards.sort((a, b) => a.name > b.name ? 1 : -1);
    for (let standard of this.selectedStep.standards) {
      const evaluation = this.selectedStep.progress?.evaluations?.find(e => e.standardId === standard.id);
      evaluationsArray.push(this.builder.group({
        standardId: standard.id,
        points: new FormControl(evaluation?.points ?? 0, [Validators.max(standard.maxPoints), Validators.min(0)]),
        comment: new FormControl(evaluation?.comment ?? '')
      }));
    }
    return evaluationsArray;
  }

  get evaluations(): FormArray {
    return this.gradingForm.get('evaluations') as FormArray;
  }

  public setAllMin() {
    this.evaluations.controls.forEach(c => c.get('points').setValue(0));
  }

  public setAllMax() {
    this.evaluations.controls.forEach((c, i) => {
      c.get('points').setValue(this.selectedStep.standards[i].maxPoints);
    });
  }

  public submit() {
    const taskProgessId = this.selectedStep.progress.taskProgressId;
    const grade = this.gradingForm.value;
    delete grade.rawEvaluation;
    this.gradingService.submitGrade(this.selectedUnitId, taskProgessId, grade)
      .subscribe(data => {
        this.selectedStep.progress = data.stepProgresses.find(stepProgress => stepProgress.stepId === this.selectedStep.id);
        this.selectedStep.progress.taskProgressId = taskProgessId;
        this.updateGradeSummaries();
      });
  }

  public copyPrompt() {
    if(this.structuredFormShown) {
      this.structuredFormShown = false;
      this.gradingForm.get('rawEvaluation').setValue('');
    }
    let standards = '';
    this.selectedStep.standards.forEach(s => {
      standards += `ID: ${s.id}; Name: ${s.name}; Guidelines: ${s.description}; Max points: ${s.maxPoints}\n`;
    });
    let prompt = this.createTag('instruction', this.systemPrompt);
    prompt += this.createTag('task',
      this.createTag('description', this.selectedTask.description + '\n' + this.selectedStep.submissionFormat.guidelines) +
      this.createTag('learner-submission', this.selectedStep.progress?.answer) +
      this.createTag('standards', standards)
    );
    this.clipboard.copy(prompt);
    this.snackBar.open('Kopiran sadržaj za ChatGPT. Odgovor stavi u "Sirova evaluacija" i klikni "Zameni formu".', "OK", { horizontalPosition: 'right', verticalPosition: 'bottom', duration: 3000 });
  }

  private createTag(tag: string, content: string): string {
    return `<${tag}>\n${content}\n</${tag}>\n`;
  }

  public showStructuredForm() {
    if(this.structuredFormShown) {
      this.gradingForm.get('rawEvaluation').setValue(JSON.stringify(this.evaluations.value, null, 2));
    } else {
      try {
        const rawEvaluation: any[] = JSON.parse(this.gradingForm.get('rawEvaluation').value);
        this.evaluations.controls.forEach(c => {
          const standardId = c.value.standardId;
          const relatedEvaluation = rawEvaluation.find(e => e['standardId'] === standardId);
          if(!relatedEvaluation) return;
          c.setValue(relatedEvaluation);
        })
      } catch(e) {
        console.log(e);
      }
    }
    this.structuredFormShown = !this.structuredFormShown;
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