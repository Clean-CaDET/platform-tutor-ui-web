import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Activity } from '../../model/activity';
import { isRequestStartedOrError, RequestStatus } from 'src/app/shared/generics/model/request-status';

@Component({
  selector: 'cc-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss']
})
export class ActivityDetailsComponent implements OnChanges {
  @Input() activity: Activity;
  @Input() activities: Activity[];
  @Input() updateStatus: RequestStatus;
  @Output() activitySaved = new EventEmitter<Activity>();

  activityForm: FormGroup;
  editMode: boolean = false;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(isRequestStartedOrError(changes.updateStatus)) return; // Triggers from parent when HTTP request starts
    this.createForm();
    if (this.activity.id || this.activity.name) {
      this.view();
      this.setInitialValues(this.activity);
    }
    else {
      this.edit();
    }
  }

  createForm() {
    this.activityForm = this.builder.group({
      code: new FormControl('', [Validators.required, this.uniqueCode(this.activities)]),
      name: new FormControl('', Validators.required),
      guidance: new FormControl(''),
      examples: this.builder.array([]),
    });

    if (!this.activity.parentId) {
      this.activityForm.addControl('submissionFormat', this.builder.group({
        type: new FormControl('Code', Validators.required),
        validationRule: new FormControl('^.{1,500}$'),
        guidelines: new FormControl('Nalepi kompletan sadržaj programa koji si iskucao (u editor Ctrl+A da se sve odabere, Ctrl+C da se kopira i onda ovde Ctrl+V da se nalepi).', Validators.required)
      }));
      this.activityForm.addControl('standards', this.builder.array([]));
    }
  }

  private uniqueCode(activities: Activity[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(!control.value) return null;
      for(let i = 0; i < activities.length; i++) {
        if(activities[i].code == control.value && activities[i].id != this.activity.id) {
          return { notUnique: true };
        }
      }
      return null;
    };
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

  edit() {
    this.editMode = true;
    this.activityForm.get('submissionFormat')?.get('type').enable();
  }

  view() {
    this.editMode = false;
    this.activityForm.get('submissionFormat')?.get('type').disable();
  }
  
  get examples(): FormArray {
    return this.activityForm.get('examples') as FormArray;
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

  addExample(): void {
    this.examples.push(this.builder.group({
      code: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required)
    }));
  }

  deleteExample(index: number): void {
    this.examples.removeAt(index);
  }

  get standards(): FormArray {
    return this.activityForm.get('standards') as FormArray;
  }

  setStandards(activity: Activity) {
    const standardsArray = this.builder.array([]) as FormArray;
    activity.standards.sort((a, b) => a.name > b.name ? 1 : -1);
    for (let standard of activity.standards) {
      standardsArray.push(this.builder.group({
        id: standard.id,
        name: new FormControl(standard.name, Validators.required),
        description: new FormControl(standard.description, Validators.required),
        maxPoints: new FormControl(standard.maxPoints, Validators.required)
      }));
    }
    return standardsArray;
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

  submit() {
    if (this.activityForm.valid) {
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
      this.view();
    } else {
      this.createForm();
    }
  }

  typeSelected() {
    this.setValidationRule();
    if(this.activityForm.value.submissionFormat.guidelines) return;
    this.setGuidelines();
  }

  private setValidationRule() {
    switch (this.activityForm.value.submissionFormat.type) {
      case "Text": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("^.{1,1000}$");
        break;
      }
      case "Link": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("");
        break;
      }
      case "Code": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("");
        break;
      }
      case "GitPR": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("^https:\\/\\/github\\.com\\/([a-zA-Z0-9_-]+)\\/([a-zA-Z0-9_-]+)\\/pull\\/([0-9]{1,4})$");
        break;
      }
      case "GitCommit": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("^https:\\/\\/github\\.com\\/([a-zA-Z0-9_-]+)\\/([a-zA-Z0-9_-]+)\\/commit\\/([a-fA-F0-9]{40})$");
        break;
      }
      case "TrelloCard": {
        this.activityForm.get('submissionFormat').get('validationRule').setValue("^https:\\/\\/trello\\.com\\/c\\/.*");
        break;
      }
    }
  }

  private setGuidelines() {
    switch (this.activityForm.value.submissionFormat.type) {
      case "Code": {
        this.activityForm.get('submissionFormat').get('guidelines').setValue("Nalepi kompletan sadržaj programa koji si iskucao (u editor Ctrl+A da se sve odabere, Ctrl+C da se kopira i onda ovde Ctrl+V da se nalepi).");
        break;
      }
      case "GitPR": {
        this.activityForm.get('submissionFormat').get('guidelines').setValue("Navedi link do pull requesta koji sabira sve izmene koje si napravio.\nPrimer: https://github.com/Clean-CaDET/tutor/pull/106");
        break;
      }
      case "GitCommit": {
        this.activityForm.get('submissionFormat').get('guidelines').setValue("Navedi link do commita na GitHubu koji uključuje naziv repozitorijuma i heš kod commita.\nPrimer: https://github.com/Clean-CaDET/tutor/commit/9d3f671042e91bda63e20dfdbe9c31204f9d6b12");
        break;
      }
      case "TrelloCard": {
        this.activityForm.get('submissionFormat').get('guidelines').setValue("Navedi link do kartice na Trello tabli koji se dobija otvaranjem kartice u browseru i kopiranjem linka.\nPrimer: https://trello.com/c/GXSjvfIs/test");
        break;
      }
    }
  }
}