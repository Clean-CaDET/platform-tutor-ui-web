import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    @Inject(MAT_DIALOG_DATA) public data) {
      this.entity = data.entity;
      this.entityCopy = JSON.parse(JSON.stringify(this.entity));

      this.fieldConfiguration = data.fieldConfiguration;
      this.createForm();
    }

  onSubmit() {
    this.entity = this.formGroup.value;
    this.entity.id = this.entityCopy.id;
    this.dialogRef.close(this.entity);
  }

  onReset() {
    this.entity = JSON.parse(JSON.stringify(this.entityCopy));
    if(this.entity.id) {
      this.formGroup.patchValue(this.entity);
    } else {
      this.formGroup.reset();
    }
  }

  onClose() {
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

  private createForm() {
    let controls = {}

    this.fieldConfiguration.forEach(f => {
      if(f.type == 'CRUD') return;
      controls[f.code] = this.createControl(f);
    });
    
    this.formGroup = this.builder.group(controls);
  }

  private createControl(field): FormControl {
    let entityValue = this.entity[field.code];
    let validators = this.createValidators(field);
    switch(field.type) {
      case 'date':
        return new FormControl(entityValue || new Date(), validators);
      case 'email':
        return new FormControl(entityValue || '', validators);
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
