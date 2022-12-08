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
      controls[c] = this.createControl(this.fieldConfiguration[c].type);
    });
    
    this.formGroup = this.builder.group(controls);
  }

  private createControl(columnType: string): FormControl {
    switch(columnType) {
      case 'date':
        return new FormControl(new Date());
      case 'email':
        return new FormControl('', Validators.email);
      default:
        return new FormControl();
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
