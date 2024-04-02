import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearningTask } from '../model/learning-task';
import { Activity } from '../model/activity';

@Component({
  selector: 'cc-task-cloning-form',
  templateUrl: './task-cloning-form.component.html',
  styleUrls: ['./task-cloning-form.component.scss']
})
export class TaskCloningFormComponent  {
  learningTaskForm: FormGroup;
  template: LearningTask;

  constructor(private builder: FormBuilder, private dialogref: MatDialogRef<TaskCloningFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.template = data?.template;
    this.createForm();
  }

  createForm(): void {
    this.learningTaskForm = this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      isTemplate: new FormControl(false) 
    });
  }

  save() {
    let learningTask = this.learningTaskForm.value;
    learningTask.steps = this.cloneSteps(this.template);
    this.dialogref.close(learningTask);
  }

  private cloneSteps(template: LearningTask): Activity[] {
    if(!this.template) return [];
    
    let clonedSteps = new Array<Activity>();
    template.steps?.forEach(step => {
      let clonedStep: Activity = JSON.parse(JSON.stringify(step));
      clonedStep.submissionFormat = step.submissionFormat; // JSON.stringify cloning removes regex.
      delete clonedStep.id;
      clonedStep.standards.forEach(s => delete s.id);
      clonedSteps.push(clonedStep);
    });

    return clonedSteps;
  }

  getMainSteps(learningTask: LearningTask) {
    return learningTask.steps.filter(s => !s.parentId);
  }

  close() {
    this.dialogref.close();
  }
}
