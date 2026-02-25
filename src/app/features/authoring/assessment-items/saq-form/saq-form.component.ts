import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownEditorComponent } from '../../../../shared/markdown/markdown-editor/markdown-editor.component';
import { AuthoringSaq } from '../model/assessment-item.model';
import { addHint, removeHint, getHintValues } from '../form.utility';

@Component({
  selector: 'cc-saq-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule, MarkdownEditorComponent,
  ],
  templateUrl: './saq-form.component.html',
})
export class SaqFormComponent {
  readonly item = input.required<AuthoringSaq>();
  readonly saveChanges = output<AuthoringSaq | null>();
  readonly requestPrompt = output<AuthoringSaq>();

  workingItem!: AuthoringSaq;
  form!: FormGroup;

  constructor() {
    effect(() => {
      const item = this.item();
      if (item) this.init(item);
    });
  }

  private init(source: AuthoringSaq): void {
    this.workingItem = JSON.parse(JSON.stringify(source));

    this.form = new FormGroup({
      feedback: new FormControl(this.workingItem.feedback ?? '', { validators: Validators.required, nonNullable: true }),
      tolerance: new FormControl(this.workingItem.tolerance ?? 0, { validators: [Validators.required, Validators.min(0)], nonNullable: true }),
      options: new FormArray<FormGroup>([]),
      hints: new FormArray<FormGroup>([]),
    });

    (this.workingItem.acceptableAnswers ?? []).forEach(item => this.addOption(item));
    if (this.options.length === 0) this.addOption('');

    (this.workingItem.hints ?? []).forEach(hint => this.addHint(hint));
  }

  get options(): FormArray { return this.form.controls['options'] as FormArray; }
  get hints(): FormArray { return this.form.controls['hints'] as FormArray; }

  asFormGroup(control: unknown): FormGroup { return control as FormGroup; }

  updateText(text: string): void { this.workingItem.text = text; }

  addOption(text: string): void {
    this.options.push(new FormGroup({
      text: new FormControl(text, { validators: Validators.required, nonNullable: true }),
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
    this.workingItem.feedback = this.form.value['feedback'];
    this.workingItem.tolerance = this.form.value['tolerance'];
    this.workingItem.acceptableAnswers = this.form.value['options'].map((o: Record<string, string>) => o['text']);
    this.workingItem.hints = getHintValues(this.hints);
  }
}
