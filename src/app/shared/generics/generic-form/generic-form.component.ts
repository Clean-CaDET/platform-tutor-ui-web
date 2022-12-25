import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Field } from '../model/field.model';

@Component({
  selector: 'cc-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent {
  fieldConfiguration;
  formGroup: FormGroup;

  entity;
  entityCopy;

  constructor(private builder: FormBuilder,
    private dialogRef: MatDialogRef<GenericFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.entity = data.entity;
      this.entityCopy = JSON.parse(JSON.stringify(this.entity));

      this.fieldConfiguration = data.fieldConfiguration;
      this.createForm();
    }

  onSubmit(): void {
    const keys = Object.keys(this.formGroup.value);
    keys.forEach(k => {
      this.entity[k] = this.formGroup.value[k];
    })
    this.dialogRef.close(this.entity);
  }

  onReset(): void {
    this.entity = JSON.parse(JSON.stringify(this.entityCopy));
    if(this.entity.id) {
      this.formGroup.patchValue(this.entity);
    } else {
      this.formGroup.reset();
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  getErrorMessage(controlName: string): string {
    if(this.formGroup.controls[controlName].hasError('required')) {
      return 'Unos je obavezan.';
    }
    if(this.formGroup.controls[controlName].hasError('email')) {
      return 'Uneti email nije validan.';
    }
    return '';
  }

  private createForm(): void {
    let controls: any = {}

    this.fieldConfiguration.forEach((f: Field) => {
      if(f.type == 'CRUD') return;
      controls[f.code] = this.createControl(f);
    });

    this.formGroup = this.builder.group(controls);
  }

  private createControl(field: Field): FormControl {
    let entityValue = this.entity[field.code];
    let validators = this.createValidators(field);
    switch(field.type) {
      case 'date':
        return new FormControl(entityValue || new Date(), validators);
      case 'email':
        return new FormControl(entityValue || '', validators);
      case 'boolean':
        return new FormControl(entityValue || false, validators);
      case 'archive':
        return new FormControl(entityValue || false, validators);
      default:
        return new FormControl(entityValue || '', validators);
    }
  }

  private createValidators(field: any) {
    let validators = [];
    if(field.type == 'email') validators.push(Validators.email);
    if(field.required) validators.push(Validators.required);
    return validators;
  }
}
