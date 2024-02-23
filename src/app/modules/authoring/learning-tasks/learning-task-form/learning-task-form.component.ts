import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cc-learning-task-form',
  templateUrl: './learning-task-form.component.html',
  styleUrls: ['./learning-task-form.component.scss']
})
export class LearningTaskFormComponent  {

  learningTaskForm: FormGroup;
  learningTask: any;

  constructor(private builder: FormBuilder, private dialogref: MatDialogRef<LearningTaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 

    this.learningTask = data.learningTask;

    this.createForm();
    
    if(this.learningTask) {
      this.learningTaskForm.patchValue(this.learningTask);
    }
  }

  createForm(): void {
    this.learningTaskForm = this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      isTemplate: new FormControl(false) 
    });
  }

  save() {
    this.dialogref.close(this.learningTaskForm.value);
  }

  close() {
    this.dialogref.close();
  }
}
