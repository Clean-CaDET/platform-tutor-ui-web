import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LearningTask } from '../model/learning-task';
import { TaskStep } from '../model/task-step';

@Component({
  selector: 'cc-learning-task-form',
  templateUrl: './learning-task-form.component.html',
  styleUrls: ['./learning-task-form.component.scss']
})
export class LearningTaskFormComponent  {
  learningTaskForm: FormGroup;
  template: LearningTask;

  constructor(private builder: FormBuilder, private dialogref: MatDialogRef<LearningTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
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

  private cloneSteps(template: LearningTask): TaskStep[] {
    if(!this.template) return [];
    
    let clonedSteps = new Array<TaskStep>();
    template.steps?.forEach(step => {
      let clonedStep: TaskStep = JSON.parse(JSON.stringify(step));
      clonedStep.submissionFormat = step.submissionFormat; // JSON.stringify cloning removes regex.
      delete clonedStep.id;
      clonedStep.standards.forEach(s => delete s.id);
      clonedSteps.push(clonedStep);
    });

    return clonedSteps;
  }

  close() {
    this.dialogref.close();
  }
}
