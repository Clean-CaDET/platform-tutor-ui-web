import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { LearningTask } from '../../model/learning-task';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-learning-task-details',
  templateUrl: './learning-task-details.component.html',
  styleUrls: ['./learning-task-details.component.scss']
})
export class LearningTaskDetailsComponent implements OnChanges {

  @Input() task: LearningTask;
  @Output() taskSaved = new EventEmitter<LearningTask>();

  taskForm: FormGroup;
  editMode: boolean = false;

  constructor(private builder: FormBuilder) { }

  ngOnChanges(): void {
    this.createForm();
    if (this.task) {
      this.setInitialValues(this.task);
    }
    this.editMode = false;
  }

  createForm() {
    this.taskForm = this.builder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      isTemplate: new FormControl(false),
    });
  }

  setInitialValues(task: LearningTask): void {
    this.taskForm.get('name').setValue(task.name);
    this.taskForm.get('description').setValue(task.description);
    this.taskForm.get('isTemplate').setValue(task.isTemplate);
  }

  submitForm() {
    if (this.taskForm.valid) {
      this.editMode = false;
      this.task.name = this.taskForm.value.name;
      this.task.description = this.taskForm.value.description;
      this.task.isTemplate = this.taskForm.value.isTemplate;
      this.taskSaved.emit(this.task);
    }
  }

  discardChanges() {
    this.setInitialValues(this.task);
    this.editMode = false;
  }
}