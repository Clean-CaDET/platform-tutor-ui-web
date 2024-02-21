import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningTasksService } from '../learning-tasks-authoring.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-case-studies',
  templateUrl: './case-studies.component.html',
  styleUrls: ['./case-studies.component.scss']
})
export class CaseStudiesComponent implements OnInit {

  caseStudiesForm: FormGroup;
  learningTask: any;
  courseId: number;
  unitId: number;
  editModes: boolean[];

  constructor(private builder: FormBuilder, private route: ActivatedRoute, private learningTasksService: LearningTasksService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseId = +params.courseId;
      this.unitId = +params.unitId;
      this.learningTasksService.get(this.unitId, +params.ltId).subscribe(learningTask => {
        this.learningTask = learningTask;
        if (!this.learningTask.caseStudies)
          this.learningTask.caseStudies = [];
        this.editModes = new Array(this.learningTask.caseStudies.length).fill(false);
        this.setInitialValues();
      });
    });
  }

  setInitialValues() {
    this.createForm();
    const caseStudies = this.setCaseStudies(this.learningTask.caseStudies);
    this.caseStudiesForm.setControl('caseStudies', caseStudies);
  }

  createForm() {
    this.caseStudiesForm = this.builder.group({
      caseStudies: this.builder.array([])
    });
  }

  setCaseStudies(caseStudies: any[]) {
    const caseStudiesArray = this.builder.array([]) as FormArray;
    for (let caseStudy of caseStudies) {
      caseStudiesArray.push(this.builder.group(caseStudy));
    }
    return caseStudiesArray;
  }

  get getCaseStudies(): any {
    return this.caseStudiesForm.get('caseStudies') as FormArray;
  }

  getCaseStudyControl(index: number, controlName: string): FormControl {
    const caseStudiesArray = this.caseStudiesForm.get('caseStudies') as FormArray;
    return (caseStudiesArray.at(index) as FormGroup).get(controlName) as FormControl;
  }

  updateCaseStudy(i: number) {
    if (this.caseStudiesForm.valid) {
      this.editModes[i] = false;
      this.save();
    }
  }

  updateUseCaseDescription(newDescription: string, index: number): void {
    this.getCaseStudyControl(index, 'description').setValue(newDescription);
  }

  discardChanges(index: number) {
    this.editModes[index] = false;
    if (this.learningTask.caseStudies[index]) {
      this.getCaseStudyControl(index, 'name').setValue(this.learningTask.caseStudies[index].name);
      this.getCaseStudyControl(index, 'description').setValue(this.learningTask.caseStudies[index].description);
    } else {
      this.deleteCaseStudy(index);
    }
  }

  deleteCaseStudy(index: number): void {
    const useCasesArray = this.caseStudiesForm.get('caseStudies') as FormArray;
    useCasesArray.removeAt(index);
    this.editModes.splice(index, 1);
    this.save();
  }

  addCaseStudy() {
    const caseStudiesArray = this.caseStudiesForm.get('caseStudies') as FormArray;
    caseStudiesArray.push(this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    }));
    this.editModes.push(true);
  }

  save() {
    this.learningTask.caseStudies = this.caseStudiesForm.get('caseStudies').value;
    this.learningTasksService.update(this.unitId, this.learningTask).subscribe(learningTask => {
      this.learningTask = learningTask;
    });
  }
}
