import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownEditorComponent } from '../../../../shared/markdown/markdown-editor/markdown-editor.component';
import { AuthoringMrq, AuthoringMrqItem } from '../model/assessment-item.model';
import { addHint, removeHint, getHintValues } from '../form.utility';

@Component({
  selector: 'cc-mrq-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule, MarkdownEditorComponent,
  ],
  templateUrl: './mrq-form.component.html',
})
export class MrqFormComponent {
  readonly item = input.required<AuthoringMrq>();
  readonly saveChanges = output<AuthoringMrq | null>();
  readonly requestPrompt = output<AuthoringMrq>();

  workingItem!: AuthoringMrq;
  form!: FormGroup;

  constructor() {
    effect(() => {
      const item = this.item();
      if (item) this.init(item);
    });
  }

  private init(source: AuthoringMrq): void {
    this.workingItem = JSON.parse(JSON.stringify(source));

    this.form = new FormGroup({
      options: new FormArray<FormGroup>([]),
      hints: new FormArray<FormGroup>([]),
    });

    (this.workingItem.items ?? []).forEach(item => this.addOption(item));
    if (this.options.length === 0) this.addOption(null);

    (this.workingItem.hints ?? []).forEach(hint => this.addHint(hint));
  }

  get options(): FormArray { return this.form.controls['options'] as FormArray; }
  get hints(): FormArray { return this.form.controls['hints'] as FormArray; }

  asFormGroup(control: unknown): FormGroup { return control as FormGroup; }

  updateText(text: string): void { this.workingItem.text = text; }

  addOption(item: AuthoringMrqItem | null): void {
    this.options.push(new FormGroup({
      isCorrect: new FormControl(item?.isCorrect ?? false, { nonNullable: true }),
      text: new FormControl(item?.text ?? '', { validators: Validators.required, nonNullable: true }),
      feedback: new FormControl(item?.feedback ?? '', { nonNullable: true }),
    }));
  }

  removeOption(index: number): void { this.options.removeAt(index); }

  addHint(text: string): void { addHint(this.hints, text); }
  removeHint(index: number): void { removeHint(this.hints, index); }

  save(): void {
    this.getFormData();
    this.saveChanges.emit(this.workingItem);
  }

  cancel(): void { this.saveChanges.emit(null); }

  copyPrompt(): void {
    this.getFormData();
    this.requestPrompt.emit(this.workingItem);
  }

  private getFormData(): void {
    this.workingItem.items = this.form.value['options'];
    this.workingItem.hints = getHintValues(this.hints);
  }
}
