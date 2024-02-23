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
  editExampleModes: boolean[];
  editStandardModes: boolean[];

  constructor(private builder: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.createForm();
    this.editExampleModes = new Array(this.activity.examples.length).fill(false);
    this.editStandardModes = new Array(this.activity.standards.length).fill(false);
    if (this.activity) {
      this.setInitialValues(this.activity);
    }
    this.editMode = false;
    if (!this.activity.id) {
      this.editMode = true;
    }
  }

  createForm() {
    this.activityForm = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      guidance: this.builder.group({
        description: new FormControl('', Validators.required),
      }),
      examples: this.builder.array([]),
      standards: this.builder.array([])
    });
  }

  setInitialValues(activity: any): void {
    this.createForm();
    this.activityForm.get('code').setValue(activity.code);
    this.activityForm.get('name').setValue(activity.name);
    this.activityForm.get('guidance.description').setValue(activity.guidance.description);
    const examplesArray = this.setExamples(activity);
    this.activityForm.setControl('examples', examplesArray);
    const standarsArray = this.setStandards(activity);
    this.activityForm.setControl('standards', standarsArray);
    this.cdr.detectChanges();
  }

  setExamples(activity: any) {
    const examplesArray = this.builder.array([]) as FormArray;
    for (let example of activity.examples) {
      examplesArray.push(this.builder.group({
        code: new FormControl(example.code, Validators.required),
        description: new FormControl(example.description, Validators.required)
      }));
    }
    return examplesArray;
  }

  setStandards(activity: any) {
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
    const examplesArray = this.activityForm.get('examples') as FormArray;
    examplesArray.push(this.builder.group({
      code: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    }));
    this.editExampleModes.push(true);
  }

  deleteExample(index: number): void {
    const examplesArray = this.activityForm.get('examples') as FormArray;
    examplesArray.removeAt(index);
    this.editExampleModes.splice(index, 1);
    this.activitySaved.emit(this.activityForm.value);
  }

  get getExamples(): any {
    return this.activityForm.get('examples') as FormArray;
  }

  getExampleControl(index: number, controlName: string): FormControl {
    const examplesArray = this.activityForm.get('examples') as FormArray;
    return (examplesArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  updateExampleDescription(newDescription: string, index: number): void {
    this.getExampleControl(index, 'description').setValue(newDescription);
  }

  updateExample(i: number) {
    if (this.activityForm.valid) {
      this.editExampleModes[i] = false;
      this.activitySaved.emit(this.activityForm.value);
    }
  }

  discardExampleChanges(index: number) {
    this.editExampleModes[index] = false;
    if (this.activity.examples[index]) {
      this.getExampleControl(index, 'code').setValue(this.activity.examples[index].code);
      this.getExampleControl(index, 'description').setValue(this.activity.examples[index].description);
    } else {
      this.deleteExample(index);
    }
  }

  addStandard() {
    const standardsArray = this.activityForm.get('standards') as FormArray;
    standardsArray.push(this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    }));
    this.editStandardModes.push(true);
  }

  deleteStandard(index: number): void {
    const standardsArray = this.activityForm.get('standards') as FormArray;
    standardsArray.removeAt(index);
    this.editStandardModes.splice(index, 1);
    this.activitySaved.emit(this.activityForm.value);
  }

  get getStandards(): any {
    return this.activityForm.get('standards') as FormArray;
  }

  getStandardControl(index: number, controlName: string): FormControl {
    const standardsArray = this.activityForm.get('standards') as FormArray;
    return (standardsArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  updateStandard(i: number) {
    if (this.activityForm.valid) {
      this.editStandardModes[i] = false;
      this.activitySaved.emit(this.activityForm.value);
    }
  }

  discardStandardChanges(index: number) {
    this.editStandardModes[index] = false;
    if (this.activity.examples[index]) {
      this.getStandardControl(index, 'name').setValue(this.activity.standards[index].name);
      this.getStandardControl(index, 'description').setValue(this.activity.standards[index].description);
    } else {
      this.deleteStandard(index);
    }
  }

  submitForm() {
    if (this.activityForm.valid) {
      this.editMode = false;
      this.editExampleModes = new Array(this.activity.examples.length).fill(false);
      this.editStandardModes = new Array(this.activity.standards.length).fill(false);
      this.activitySaved.emit(this.activityForm.value);
    }
  }

  discardChanges() {
    this.setInitialValues(this.activity);
    if (this.activity.id != undefined) {
      this.editMode = false;
    }
    this.editExampleModes = new Array(this.activity.examples.length).fill(false);
    this.editStandardModes = new Array(this.activity.standards.length).fill(false);
  }
}