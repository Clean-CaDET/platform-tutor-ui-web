import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent implements OnInit {
  @Input() fieldConfiguration;
  columns: string[];
  formGroup: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.columns = Object.keys(this.fieldConfiguration);
    this.createForm();
  }

  private createForm() {
    let controls = {}

    this.columns.forEach(c => {
      controls[c] = this.createControl(this.fieldConfiguration[c]);
    });
    
    this.formGroup = this.builder.group(controls);
  }

  private createControl(field): FormControl {
    switch(field.type) {
      case 'date':
        return new FormControl({value: new Date(), disabled: field.readOnly});
      case 'email':
        return new FormControl({value: '', disabled: field.readOnly}, Validators.email);
      default:
        return new FormControl({value: '', disabled: field.readOnly});
    }
  }

  onSubmit() {
    console.log(this.formGroup);
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
}
