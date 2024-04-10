import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { LearningTask } from '../../model/learning-task';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'cc-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnChanges {

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
      order: new FormControl(0),
    });
  }

  setInitialValues(task: LearningTask): void {
    this.taskForm.get('name').setValue(task.name);
    this.taskForm.get('description').setValue(task.description);
    this.taskForm.get('isTemplate').setValue(task.isTemplate);
    this.taskForm.get('order').setValue(task.order);
  }

  submitForm() {
    if (this.taskForm.valid) {
      this.editMode = false;
      this.task.name = this.taskForm.value.name;
      this.task.description = this.taskForm.value.description;
      this.task.isTemplate = this.taskForm.value.isTemplate;
      this.task.order = this.taskForm.value.order;
      this.taskSaved.emit(this.task);
    }
  }

  discardChanges() {
    this.setInitialValues(this.task);
    this.editMode = false;
  }
}