import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { LearningTasksService } from '../learning-tasks-authoring.service';
import { CourseStructureService } from '../../course-structure/course-structure.service';

@Component({
  selector: 'cc-step-form',
  templateUrl: './step-form.component.html',
  styleUrls: ['./step-form.component.scss']
})
export class StepFormComponent implements OnInit {

  stepForm: FormGroup;
  learningTask: any;
  courseId: number;
  unitId: number;
  idParam: number;
  step: any;
  activityOptions: any[];
  editMode: boolean = false;
  selectedActivity: any;

  filteredOptions: Observable<any[]>;

  constructor(private builder: FormBuilder, private route: ActivatedRoute, private learningTasksService: LearningTasksService,
    private courseService: CourseStructureService, private router: Router) { }

  ngOnInit() {
    this.setInitialValues();
    this.createForm();
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.courseService.getCourseActivities(this.courseId).subscribe(activities => {
        this.activityOptions = activities;
        this.initialize();
        this.filteredOptions = this.stepForm.controls['activityId'].valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value || '')),
        );
      });
    });
  }

  setInitialValues() {
    this.learningTask = {
      name: '',
      maxPoints: 0
    };
    this.step = {
      maxPoints: 0
    };
  }

  createForm() {
    this.stepForm = this.builder.group({
      order: new FormControl('', Validators.required),
      activityId: new FormControl('', Validators.required),
      activityName: new FormControl(''),
      submissionFormat: this.builder.group({
        submissionGuidelines: new FormControl('', Validators.required),
        answerValidation: new FormControl('')
      }),
      standards: this.builder.array([])
    });
  }

  initialize() {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.learningTasksService.get(this.unitId, +params.ltId).subscribe(learningTask => {
        this.learningTask = learningTask;
        this.idParam = this.route.snapshot.queryParams['id'];
        if (this.idParam) {
          this.step = this.learningTask.steps.find((s: { id: any; }) => s.id == this.idParam);
        }
        this.setInitialFormValues();
      });
    });
  }

  setInitialFormValues() {
    if (!this.step.order) {
      this.stepForm.patchValue({ order: this.learningTask.steps.length + 1 });
      this.editMode = true;
      return;
    }
    this.editMode = false;
    this.stepForm.patchValue(this.step);
    this.stepForm.patchValue({
      activityId: this.presentActivity(this.findActivity(this.step.activityId)),
      activityName: this.findActivity(this.step.activityId).name
    });
    if (!this.learningTask.isTemplate) {
      this.setStandards();
    }
  }

  setStandards() {
    this.stepForm.setControl('standards', this.builder.array([]));
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

  onActivitySelect(activityName: any) {
    let activity = this.findActivityByName(activityName);
    this.setActivityStandards(activity);
    this.selectedActivity = activity;
  }

  setActivityStandards(activity: any) {
    if (this.learningTask.isTemplate)
      return;
    for (let standard of activity.standards) {
      if (this.standardExists(standard)) continue;
      this.standardsFormArray.push(this.builder.group({
        name: this.builder.control(standard.name, Validators.required),
        description: this.builder.control(standard.description, Validators.required),
        maxPoints: this.builder.control(0, Validators.required)
      }));
    }
    this.insertBlankStandard(activity);
  }

  standardExists(standard: any) {
    return this.standardsFormArray.controls.find((control: FormGroup) => {
      return control.get('name').value === standard.name && control.get('description').value === standard.description;
    });
  }

  insertBlankStandard(activity: any) {
    if (activity.standards.length == 0 && this.standardsFormArray.length == 0) {
      this.standardsFormArray.push(this.builder.group({
        name: this.builder.control('', Validators.required),
        description: this.builder.control('', Validators.required),
        maxPoints: this.builder.control('', Validators.required)
      }));
    }
    return activity;
  }

  addStandard() {
    this.standardsFormArray.push(this.builder.group({
      name: this.builder.control('', Validators.required),
      description: this.builder.control('', Validators.required),
      maxPoints: this.builder.control(0, Validators.required)
    }));
  }

  removeStandard(index: number) {
    this.standardsFormArray.removeAt(index);
  }

  discardChanges() {
    this.setInitialFormValues();
    this.selectedActivity = null;
  }

  save() {
    let activity = this.findActivityByName(this.stepForm.get('activityId').value);
    this.stepForm.get('activityId').setValue(activity.id);
    this.stepForm.get('activityName').setValue(activity.name);
    if (this.idParam) {
      this.editStep();
    } else {
      this.addNewStep();
    }
    this.updateLearningTask();
  }

  editStep() {
    const stepIndex = this.learningTask.steps.findIndex((s: { id: number; }) => s.id == this.idParam);
    this.step = this.stepForm.value;
    this.step.id = this.idParam;
    this.learningTask.steps[stepIndex] = this.step;
  }

  addNewStep() {
    this.learningTask.steps.push(this.stepForm.value);
  }

  updateLearningTask() {
    let order = this.stepForm.get('order').value;
    this.learningTasksService.update(this.unitId, this.learningTask).subscribe(updatedLearningTask => {
      this.learningTask = updatedLearningTask;
      this.step = this.learningTask.steps.find((s: { order: number; }) => s.order == order);
      this.idParam = this.step.id;
      this.router.navigate([], {
        queryParams: { id: this.idParam },
        queryParamsHandling: 'merge'
      });
      this.setInitialFormValues();
      this.editMode = false;
      this.selectedActivity = null;
    });
  }

  noItemSelected() {
    return !this.activityOptions.find(o => this.presentActivity(o) === this.stepForm.controls['activityId'].value)
  }
}
