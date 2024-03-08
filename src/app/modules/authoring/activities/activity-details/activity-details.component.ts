import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../learning-tasks/model/activity';

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

  constructor(private builder: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.createForm();
    if (this.activity.id) {
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
      submissionFormat: this.builder.group({
        guidelines: new FormControl('', Validators.required),
        validationRule: new FormControl('')
      }),
      examples: this.builder.array([]),
      standards: this.builder.array([])
    });
  }

  setInitialValues(activity: Activity): void {
    this.activityForm.get('code').setValue(activity.code);
    this.activityForm.get('name').setValue(activity.name);
    this.activityForm.get('guidance').setValue(activity.guidance);
    const examplesArray = this.setExamples(activity);
    this.activityForm.setControl('examples', examplesArray);
    const standarsArray = this.setStandards(activity);
    this.activityForm.setControl('standards', standarsArray);
    this.activityForm.get('submissionFormat').get('guidelines').setValue(activity.submissionFormat.guidelines);
    this.activityForm.get('submissionFormat').get('validationRule').setValue(activity.submissionFormat.validationRule);
    this.cdr.detectChanges();
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
        description: new FormControl(standard.description, Validators.required)
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

  addStandard() {
    this.standards.push(this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
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