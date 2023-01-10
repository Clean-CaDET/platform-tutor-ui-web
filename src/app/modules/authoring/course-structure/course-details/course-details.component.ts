import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/modules/learning/model/course.model';

@Component({
  selector: 'cc-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnChanges {
  @Input() course: Course;
  @Output() courseUpdated = new EventEmitter<Course>();
  editMode: boolean;

  courseForm: FormGroup

  constructor(private builder: FormBuilder) { }

  ngOnChanges() {
    if(!this.courseForm) this.createForm();
    if(this.course) {
      this.courseForm.patchValue(this.course);
    }
  }

  private createForm(): void {
    this.courseForm = this.builder.group({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('')
    });
  }

  discardChanges() {
    this.courseForm.patchValue(this.course);
    this.editMode = false;
  }

  saveChanges() {
    let newCourse: Course = {
      id: this.course.id,
      code: this.courseForm.value['code'],
      name: this.courseForm.value['name'],
      description: this.courseForm.value['description'],
    };

    this.editMode = false;

    this.courseUpdated.emit(newCourse);
  }
}
