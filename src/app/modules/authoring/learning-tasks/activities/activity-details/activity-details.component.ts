import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../model/activity';

@Component({
  selector: 'cc-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnChanges {

  @Input() activity: Activity;
  @Output() activitySaved = new EventEmitter<Activity>();

  activityForm: FormGroup;
  editMode: boolean = false;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(): void {
    this.createForm();
    if (this.activity.id) {
      this.editMode = false;
      this.setInitialValues(this.activity);
    }
    else {
      this.editMode = true;
    }
  }

  createForm() {
    this.activityForm = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      guidance: new FormControl('', Validators.required),
      examples: this.builder.array([]),
    });

    if (!this.activity.parentId) {
      this.activityForm.addControl('submissionFormat', this.builder.group({
        type: new FormControl('Code', Validators.required),
        validationRule: new FormControl(''),
        guidelines: new FormControl('', Validators.required)
      }));
      this.activityForm.addControl('standards', this.builder.array([]));
    }
  }

  setInitialValues(activity: Activity): void {
    this.activityForm.get('code').setValue(activity.code);
    this.activityForm.get('name').setValue(activity.name);
    this.activityForm.get('guidance').setValue(activity.guidance);
    const examplesArray = this.setExamples(activity);
    this.activityForm.setControl('examples', examplesArray);
    if (!this.activity.parentId) {
      const standarsArray = this.setStandards(activity);
      this.activityForm.setControl('standards', standarsArray);
      this.activityForm.get('submissionFormat').get('type').setValue(activity.submissionFormat.type);
      this.activityForm.get('submissionFormat').get('validationRule').setValue(activity.submissionFormat.validationRule);
      this.activityForm.get('submissionFormat').get('guidelines').setValue(activity.submissionFormat.guidelines);
    }
  }

  get examples(): FormArray {
    return this.activityForm.get('examples') as FormArray;
  }

  get standards(): FormArray {
    return this.activityForm.get('standards') as FormArray;
  }

  setExamples(activity: Activity) {
    const examplesArray = this.builder.array([]) as FormArray;
    for (let example of activity.examples) {
      examplesArray.push(this.builder.group({
        code: new FormControl(example.code, Validators.required),
        url: new FormControl(example.url, Validators.required)
      }));
    }
    return examplesArray;
  }

  setStandards(activity: Activity) {
    const standardsArray = this.builder.array([]) as FormArray;
    for (let standard of activity.standards) {
      standardsArray.push(this.builder.group({
        name: new FormControl(standard.name, Validators.required),
        description: new FormControl(standard.description, Validators.required),
        maxPoints: new FormControl(standard.maxPoints, Validators.required)
      }));
    }
    return standardsArray;
  }

  addExample(): void {
    this.examples.push(this.builder.group({
      code: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required)
    }));
  }

  deleteExample(index: number): void {
    this.examples.removeAt(index);
  }

  typeSelected() {
    switch(this.activityForm.value.submissionFormat.type) {
      case "Text": this.activityForm.get('submissionFormat').get('validationRule').setValue("^.{200}$"); break;
      case "Link": this.activityForm.get('submissionFormat').get('validationRule').setValue("^https:\\/\\/github\\.com\\/[a-zA-Z0-9_-]+\\/[a-zA-Z0-9_-]+\\/?$"); break;
      default: this.activityForm.get('submissionFormat').get('validationRule').setValue("^.{200}$"); 
    }
  }

  addStandard() {
    this.standards.push(this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      maxPoints: new FormControl('', Validators.required)
    }));
  }

  deleteStandard(index: number): void {
    this.standards.removeAt(index);
  }

  submitForm() {
    if (this.activityForm.valid) {
      this.editMode = false;
      let changedActivity = this.activityForm.value;
      changedActivity.id = this.activity.id;
      changedActivity.parentId = this.activity.parentId;
      changedActivity.order = this.activity.order;
      this.activitySaved.emit(changedActivity);
    }
  }

  discardChanges() {
    if (this.activity.id) {
      this.setInitialValues(this.activity);
      this.editMode = false;
    } else {
      this.createForm();
    }
  }
}