import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnChanges {

  @Input() activity: any;
  @Output() activitySaved = new EventEmitter<any>();

  activityForm: FormGroup;
  editMode: boolean = false;
  editModes: boolean[];

  constructor(private builder: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.createForm();
    this.editModes = new Array(this.activity.examples.length).fill(false);
    if (this.activity) {
      this.setInitialValues(this.activity);
    }
    this.editMode = false;
    if (this.activity.id == undefined) {
      this.editMode = true;
    }
  }

  createForm() {
    this.activityForm = this.builder.group({
      name: new FormControl('', Validators.required),
      guidance: this.builder.group({
        description: new FormControl('', Validators.required),
      }),
      examples: this.builder.array([])
    });
  }

  addExample(): void {
    const examplesArray = this.activityForm.get('examples') as FormArray;
    examplesArray.push(this.builder.group({ code: '', description: '' }));
    this.editModes.push(true);
  }

  deleteExample(index: number): void {
    const examplesArray = this.activityForm.get('examples') as FormArray;
    examplesArray.removeAt(index);
  }

  get getExamples(): any {
    return this.activityForm.get('examples') as FormArray;
  }

  getExampleControl(index: number, controlName: string): FormControl {
    const examplesArray = this.activityForm.get('examples') as FormArray;
    return (examplesArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  setInitialValues(activity: any): void {
    this.createForm();
    this.activityForm.get('name').setValue(activity.name);
    this.activityForm.get('guidance.description').setValue(activity.guidance.description);
    const examplesArray = this.builder.array([]) as FormArray;
    for (let example of activity.examples) {
      examplesArray.push(this.builder.group(example));
    }
    this.activityForm.setControl('examples', examplesArray);
    this.cdr.detectChanges();
  }

  updateExampleDescription(newDescription: string, index: number): void {
    this.getExampleControl(index, 'description').setValue(newDescription);
  }

  submitForm() {
    if (!this.activityForm.valid) {
      console.log("nije validna");
      return;
    } else {
      console.log(this.activityForm.value);
    }
    this.editMode = false;
    this.editModes = new Array(this.activity.examples.length).fill(false);
    this.activitySaved.emit(this.activityForm.value);
  }

  discardChanges() {
    this.setInitialValues(this.activity);
    if (this.activity.id != undefined) {
      this.editMode = false;
    }
    this.editModes = new Array(this.activity.examples.length).fill(false);
  }
}