import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'cc-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.scss']
})
export class StepFormComponent {

  stepForm: FormGroup;
  order: number;
  step: any;
  activityOptions: any[];
  isTemplate: boolean;

  filteredOptions: Observable<any[]>;

  constructor(private builder: FormBuilder, private dialogRef: MatDialogRef<StepFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = data.order;
    this.step = data.step;
    this.activityOptions = data.activityOptions;
    this.isTemplate = data.isTemplate;

    this.createForm();
    if (this.step) {
      this.stepForm.patchValue(this.step);
      this.stepForm.patchValue({ activityId: this.presentActivity(this.findActivity(this.step.activityId)) });
      this.stepForm.patchValue({ activityName: this.findActivity(this.step.activityId).name });
      if (!this.isTemplate) {
        this.setStandards();
      }
    }

    this.filteredOptions = this.stepForm.controls['activityId'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  createForm(): void {
    this.stepForm = this.builder.group({
      order: new FormControl(this.order, Validators.required),
      activityId: new FormControl('', Validators.required),
      activityName: new FormControl(''),
      submissionFormat: this.builder.group({
        submissionGuidelines: new FormControl('', Validators.required),
        answerValidation: new FormControl('', Validators.required)
      }),
      standards: this.builder.array([])
    });
  }

  setStandards() {
    for (let standard of this.step.standards) {
      this.standardsFormArray.push(this.builder.group({
        name: this.builder.control(standard.name, Validators.required),
        description: this.builder.control(standard.description, Validators.required),
        maxPoints: this.builder.control(standard.maxPoints, Validators.required)
      }));
    }
  }

  findActivity(id: number): any {
    if (this.activityOptions.length === 0) return null;
    return this.activityOptions.find(p => p.id === id);
  }

  findActivityByName(name: string): any {
    if (this.activityOptions.length === 0) return null;
    return this.activityOptions.find(p => (p.code + ": " + p.name) == name);
  }

  presentActivity(option: any): string {
    return option.code + ": " + option.name;
  }

  _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.activityOptions.filter(option => this.presentActivity(option).toLowerCase().includes(filterValue));
  }

  get standardsFormArray(): any {
    return this.stepForm.get('standards') as FormArray;
  }

  getStandards(activityName: any) {
    if(this.isTemplate)
      return;
    let activity = this.findActivityByName(activityName);
    this.stepForm.setControl('standards', this.builder.array([]));
    for (let standard of activity.standards) {
      this.standardsFormArray.push(this.builder.group({
        name: this.builder.control(standard.name, Validators.required),
        description: this.builder.control(standard.description, Validators.required),
        maxPoints: this.builder.control(0, Validators.required)
      }));
    }
  }

  save() {
    let activity = this.findActivityByName(this.stepForm.get('activityId').value);
    this.stepForm.get('activityId').setValue(activity.id);
    this.stepForm.get('activityName').setValue(activity.name);
    this.dialogRef.close(this.stepForm.value);
  }

  noItemSelected() {
    return !this.activityOptions.find(o => this.presentActivity(o) === this.stepForm.controls['activityId'].value)

  }
}
