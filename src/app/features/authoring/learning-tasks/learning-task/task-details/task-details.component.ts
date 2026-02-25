import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LearningTask } from '../../../../learning/task/model/learning-task.model';
import { RequestStatus } from '../../../../../shared/model/request-status.model';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { MarkdownEditorComponent } from '../../../../../shared/markdown/markdown-editor/markdown-editor.component';

@Component({
  selector: 'cc-task-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    CcMarkdownComponent, MarkdownEditorComponent,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent {
  protected readonly RequestStatus = RequestStatus;

  readonly task = input.required<LearningTask>();
  readonly updateStatus = input(RequestStatus.None);
  readonly taskSaved = output<LearningTask>();

  editMode = signal(false);
  description = signal('');

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    isTemplate: new FormControl(false, { nonNullable: true }),
    order: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    effect(() => {
      const task = this.task();
      const status = this.updateStatus();
      if (status === RequestStatus.Started || status === RequestStatus.Error) return;
      this.setInitialValues(task);
      this.editMode.set(false);
    });
    effect(() => {
      if (this.editMode()) {
        this.form.controls.isTemplate.enable();
      } else {
        this.form.controls.isTemplate.disable();
      }
    });
  }

  private setInitialValues(task: LearningTask): void {
    this.form.patchValue({ name: task.name, isTemplate: task.isTemplate, order: task.order ?? 0 });
    this.description.set(task.description ?? '');
  }

  submit(): void {
    if (this.form.valid) {
      const values = this.form.getRawValue();
      const updated: LearningTask = {
        ...this.task(),
        name: values.name,
        description: this.description(),
        isTemplate: values.isTemplate,
        order: values.order,
      };
      this.taskSaved.emit(updated);
    }
  }

  discardChanges(): void {
    this.setInitialValues(this.task());
    this.editMode.set(false);
  }
}
