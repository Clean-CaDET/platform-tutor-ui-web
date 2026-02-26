import { Component, ChangeDetectionStrategy, inject, input, output, signal, effect, untracked } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MonitoringUnit } from '../model/unit.model';
import { Learner, getAdjacentLearner } from '../model/learner.model';
import { GradingService } from './grading.service';
import { GradingTask, GradingStep } from './model/grading-task.model';
import { GradingTaskProgress } from './model/grading-progress.model';
import { gradingInstruction } from './model/grading.constants';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { ClipboardButtonComponent } from '../../../shared/markdown/clipboard-button/clipboard-button.component';
import { MarkdownEditorComponent } from '../../../shared/markdown/markdown-editor/markdown-editor.component';

@Component({
  selector: 'cc-grading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, ScrollingModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule,
    MatButtonModule, MatDividerModule, MatTooltipModule, MatProgressBarModule,
    CcMarkdownComponent, MarkdownEditorComponent,
  ],
  templateUrl: './grading.component.html',
  styleUrl: './grading.component.scss',
})
export class GradingComponent {
  readonly clipboardComponent = ClipboardButtonComponent;
  private readonly gradingService = inject(GradingService);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  readonly courseId = input.required<number>();
  readonly selectedLearnerId = input.required<number>();
  readonly learners = input.required<Learner[]>();
  readonly selectedDate = input.required<Date>();
  readonly learnerChanged = output<Learner>();
  readonly gradesChanged = output<GradingTaskProgress[]>();

  readonly units = signal<MonitoringUnit[]>([]);
  readonly tasks = signal<GradingTask[]>([]);
  readonly selectedTask = signal<GradingTask | null>(null);
  readonly selectedStep = signal<GradingStep | null>(null);
  readonly progressBarActive = signal(false);
  readonly structuredFormShown = signal(true);
  readonly sortedStandards = signal<GradingStep['standards']>([]);

  readonly selectedUnitId = signal(0);
  gradingForm: FormGroup | null = null;

  constructor() {
    effect(() => {
      this.selectedDate();
      this.getUnits();
    });

    effect(() => {
      this.selectedLearnerId();
      if (untracked(() => this.selectedUnitId())) {
        this.getTaskProgresses();
      }
    });
  }

  private getUnits(): void {
    const date = this.selectedDate();
    if (!date) return;
    this.gradingService.getWeeklyUnits(this.courseId(), this.selectedLearnerId(), date).subscribe(units => {
      const sorted = units.sort((a, b) => a.order - b.order);
      if (this.selectedUnitId() && !sorted.some(u => u.id === this.selectedUnitId())) {
        this.selectedUnitId.set(0);
        this.tasks.set([]);
        this.selectedStep.set(null);
      }
      this.units.set(sorted);
      this.updateGradeSummaries();
    });
  }

  private updateGradeSummaries(): void {
    this.gradingService.getGroupSummaries(this.units().map(u => u.id), this.learners().map(l => l.id)).subscribe(summaries => {
      this.gradesChanged.emit(summaries);
    });
  }

  getTasks(): void {
    this.tasks.set([]);
    this.selectedStep.set(null);
    this.gradingService.getTasks(this.selectedUnitId()).subscribe(data => {
      if (!data?.length) return;
      const sorted = data.sort((a, b) => a.order - b.order);
      sorted.forEach(task =>
        task.steps = task.steps
          .filter(s => !s.parentId)
          .sort((a, b) => a.order - b.order),
      );
      this.tasks.set(sorted);
      this.selectedTask.set(sorted[0]);
      this.selectedStep.set(sorted[0].steps[0]);
      this.getTaskProgresses();
    });
  }

  private getTaskProgresses(): void {
    this.gradingService.getTaskProgresses(this.selectedUnitId(), this.selectedLearnerId()).subscribe(data => {
      this.addStepProgressToTasks(data);
      this.refreshSelectedStepFromTasks();
      if (this.selectedStep()) this.createForm();
    });
  }

  private refreshSelectedStepFromTasks(): void {
    const currentStep = this.selectedStep();
    if (!currentStep) return;
    const tasks = this.tasks();
    for (const task of tasks) {
      const step = task.steps.find(s => s.id === currentStep.id);
      if (step) {
        this.selectedTask.set(task);
        this.selectedStep.set(step);
        return;
      }
    }
  }

  private addStepProgressToTasks(taskProgresses: GradingTaskProgress[]): void {
    const updated = this.tasks().map(task => {
      const progress = taskProgresses.find(p => p.learningTaskId === task.id);
      const steps = task.steps.map(step => {
        const stepProgress = progress?.stepProgresses?.find(s => s.stepId === step.id);
        if (stepProgress && progress) {
          return { ...step, progress: { ...stepProgress, taskProgressId: progress.id } };
        }
        return { ...step, progress: undefined };
      });
      return { ...task, steps };
    });
    this.tasks.set(updated);
  }

  isUnanswered(step: GradingStep): boolean {
    if (!step.progress) return true;
    return step.progress.status !== 'Answered' && step.progress.status !== 'Graded';
  }

  select(task: GradingTask, step: GradingStep): void {
    if (this.isUnanswered(step)) return;
    this.selectedTask.set(task);
    this.selectedStep.set(step);
    this.createForm();
    this.scrollTo('text');
  }

  private createForm(): void {
    const step = this.selectedStep()!;
    const standards = [...(step.standards ?? [])].sort((a, b) => a.name > b.name ? 1 : -1);
    this.sortedStandards.set(standards);
    this.structuredFormShown.set(true);
    this.gradingForm = new FormGroup({
      stepId: new FormControl(step.id),
      evaluations: this.createEvaluations(standards),
      comment: new FormControl(step.progress?.comment ?? ''),
      rawEvaluation: new FormControl(''),
    });
  }

  private createEvaluations(standards: GradingStep['standards']): FormArray {
    const evaluationsArray = new FormArray<FormGroup>([]);
    const step = this.selectedStep()!;
    for (const standard of standards!) {
      const evaluation = step.progress?.evaluations?.find(e => e.standardId === standard.id);
      evaluationsArray.push(new FormGroup({
        standardId: new FormControl(standard.id),
        points: new FormControl(evaluation?.points ?? 0, [Validators.max(standard.maxPoints), Validators.min(0)]),
        comment: new FormControl(evaluation?.comment ?? ''),
      }));
    }
    return evaluationsArray;
  }

  get evaluations(): FormArray {
    return this.gradingForm!.get('evaluations') as FormArray;
  }

  get typedEvaluations(): FormGroup[] {
    return this.evaluations.controls as FormGroup[];
  }

  setAllMin(): void {
    this.evaluations.controls.forEach(c => c.get('points')!.setValue(0));
  }

  setAllMax(): void {
    const standards = this.sortedStandards()!;
    this.evaluations.controls.forEach((c, i) => {
      c.get('points')!.setValue(standards[i].maxPoints);
    });
  }

  submit(): void {
    this.progressBarActive.set(true);
    const step = this.selectedStep()!;
    const taskProgressId = step.progress!.taskProgressId;
    const { rawEvaluation, ...grade } = this.gradingForm!.value;
    this.gradingService.submitGrade(this.selectedUnitId(), taskProgressId, grade)
      .subscribe({
        next: data => {
          const updatedProgress = data.stepProgresses?.find(sp => sp.stepId === step.id);
          if (updatedProgress) {
            const updatedStep = { ...step, progress: { ...updatedProgress, taskProgressId } };
            this.selectedStep.set(updatedStep);
            this.tasks.update(tasks => tasks.map(t => ({
              ...t,
              steps: t.steps.map(s => s.id === step.id ? updatedStep : s),
            })));
          }
          this.gradingForm!.markAsPristine();
          this.progressBarActive.set(false);
          this.updateGradeSummaries();
        },
        error: () => this.progressBarActive.set(false),
      });
  }

  copyPrompt(): void {
    const step = this.selectedStep()!;
    const task = this.selectedTask()!;
    if (this.structuredFormShown()) {
      this.structuredFormShown.set(false);
      this.gradingForm!.get('rawEvaluation')!.setValue('');
    }
    let standards = '';
    step.standards?.forEach(s => {
      standards += `ID: ${s.id}; Name: ${s.name}; Guidelines: ${s.description}; Max points: ${s.maxPoints}\n`;
    });
    let prompt = this.createTag('instruction', gradingInstruction);
    prompt += this.createTag('task',
      this.createTag('description', (task.description ?? '') + '\n' + step.submissionFormat.guidelines) +
      this.createTag('learner-submission', step.progress?.answer ?? '') +
      this.createTag('standards', standards),
    );
    this.clipboard.copy(prompt);
    this.snackBar.open('Kopirano. Odgovor ChatGPTa stavi u "Sirova evaluacija" i klikni "Zameni formu".', 'OK', {
      horizontalPosition: 'right', verticalPosition: 'bottom', duration: 3000,
    });
  }

  private createTag(tag: string, content: string): string {
    return `<${tag}>\n${content}\n</${tag}>\n`;
  }

  showStructuredForm(): void {
    try {
      const rawEvaluation: { standardId: number; points: number; comment: string }[] = JSON.parse(this.gradingForm!.get('rawEvaluation')!.value);
      this.evaluations.controls.forEach(c => {
        const standardId = c.value.standardId;
        const relatedEvaluation = rawEvaluation.find(e => e.standardId === standardId);
        if (!relatedEvaluation) return;
        c.setValue(relatedEvaluation);
      });
      const additionalComment = rawEvaluation.find(e => e.standardId === 0);
      if (additionalComment) this.gradingForm!.get('comment')!.setValue(additionalComment.comment);
    } catch (e) {
      console.log(e);
    }
    this.structuredFormShown.update(v => !v);
  }

  changeLearner(direction: number): void {
    const next = getAdjacentLearner(this.learners(), this.selectedLearnerId(), direction);
    if (next) this.learnerChanged.emit(next);
  }

  changeStep(direction: number): void {
    const task = this.selectedTask()!;
    const step = this.selectedStep()!;
    const currentStepIndex = task.steps.indexOf(step);
    if ((direction === -1 && currentStepIndex > 0) ||
       (direction === 1 && currentStepIndex < task.steps.length - 1)) {
      this.selectedStep.set(task.steps[currentStepIndex + direction]);
      this.createForm();
      this.scrollTo('text');
      return;
    }
    this.changeTask(direction);
  }

  private changeTask(direction: number): void {
    const tasks = this.tasks();
    const task = this.selectedTask()!;
    const currentTaskIndex = tasks.indexOf(task);
    const newIndex = (currentTaskIndex + direction + tasks.length) % tasks.length;
    this.selectedTask.set(tasks[newIndex]);
    const newTask = tasks[newIndex];
    this.selectedStep.set(direction === 1 ? newTask.steps[0] : newTask.steps[newTask.steps.length - 1]);
    this.createForm();
    this.scrollTo('text');
  }

  scrollTo(item: string): void {
    setTimeout(() => { document.querySelector('#' + item)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 0);
  }
}
