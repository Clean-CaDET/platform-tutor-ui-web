import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cc-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit {
  @Input() fieldConfiguration;
  columns: string[];
  formGroup: FormGroup;
  
  entityCopy;

  constructor(private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public entity) { }

  ngOnInit(): void {
    this.columns = Object.keys(this.fieldConfiguration);
    this.createForm();
    this.entityCopy = JSON.parse(JSON.stringify(this.entity));
  }

  onSubmit() {
    console.log(this.formGroup);
  }

  onReset() {
    this.entity = JSON.parse(JSON.stringify(this.entityCopy));
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

    this.columns.forEach(c => {
      controls[c] = this.createControl(this.fieldConfiguration[c]);
    });
    
    this.formGroup = this.builder.group(controls);
  }

  private createControl(field): FormControl {
    let validators = this.createValidators(field);
    switch(field.type) {
      case 'date':
        return new FormControl({value: new Date(), disabled: field.readOnly}, validators);
      case 'email':
        return new FormControl({value: '', disabled: field.readOnly}, validators);
      default:
        return new FormControl({value: '', disabled: field.readOnly}, validators);
    }
  }
  
  private createValidators(field: any) {
    let validators = [];
    if(field.type == 'email') validators.push(Validators.email);
    if(field.required) validators.push(Validators.required);
    return validators;
  }
}
