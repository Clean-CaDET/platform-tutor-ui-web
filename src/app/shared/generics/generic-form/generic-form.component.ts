import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { CcMarkdownComponent } from '../../markdown/cc-markdown.component';
import { Field } from '../model/field.model';

@Component({
  selector: 'cc-generic-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule, MatDialogContent, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatRadioModule, CcMarkdownComponent,
  ],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.scss',
})
export class GenericFormComponent {
  private readonly builder = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<GenericFormComponent>);
  private readonly data = inject<{ entity: Record<string, unknown>; fieldConfiguration: Field[]; label: string }>(MAT_DIALOG_DATA);

  fieldConfiguration: Field[];
  formGroup!: FormGroup;
  entity: Record<string, unknown>;
  entityCopy: Record<string, unknown>;
  label: string;

  constructor() {
    this.entity = this.data.entity;
    this.entityCopy = JSON.parse(JSON.stringify(this.entity));
    this.fieldConfiguration = this.data.fieldConfiguration;
    this.label = this.data.label;
    this.createForm();
  }

  onSubmit(): void {
    const keys = Object.keys(this.formGroup.value);
    keys.forEach(k => {
      this.entity[k] = this.formGroup.value[k];
    });
    this.dialogRef.close(this.entity);
  }

  onReset(): void {
    this.entity = JSON.parse(JSON.stringify(this.entityCopy));
    if (this.entity['id']) {
      this.formGroup.patchValue(this.entity);
    } else {
      this.formGroup.reset();
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    if (this.formGroup.controls[controlName].hasError('required')) {
      return 'Unos je obavezan.';
    }
    if (this.formGroup.controls[controlName].hasError('email')) {
      return 'Uneti email nije validan.';
    }
    return '';
  }

  private createForm(): void {
    const controls: Record<string, FormControl> = {};
    this.fieldConfiguration.forEach((f: Field) => {
      if (f.type === 'CRUD') return;
      controls[f.code] = this.createControl(f);
    });
    this.formGroup = this.builder.group(controls);
  }

  private createControl(field: Field): FormControl {
    const entityValue = this.entity[field.code];
    const validators = this.createValidators(field);
    switch (field.type) {
      case 'date':
        return new FormControl(entityValue || new Date(), validators);
      case 'email':
        return new FormControl(entityValue || '', validators);
      case 'boolean':
      case 'archive':
        return new FormControl(entityValue || false, validators);
      default:
        return new FormControl(entityValue || '', validators);
    }
  }

  private createValidators(field: Field): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.type === 'email') validators.push(Validators.email);
    if (field.required) validators.push(Validators.required);
    return validators;
  }
}
