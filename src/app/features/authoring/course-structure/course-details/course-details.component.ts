import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Course } from '../../model/course.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-course-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './course-details.component.html',
  styles: `.highlight { color: var(--mat-sys-primary); }`,
})
export class CourseDetailsComponent {
  course = input.required<Course>();
  courseUpdated = output<Course>();

  editMode = signal(false);

  courseForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const course = this.course();
      this.courseForm.patchValue(course);
    });
  }

  discardChanges(): void {
    this.courseForm.patchValue(this.course());
    this.editMode.set(false);
  }

  saveChanges(): void {
    const course = this.course();
    const newCourse: Course = {
      id: course.id,
      code: this.courseForm.getRawValue().code,
      name: this.courseForm.getRawValue().name,
      description: this.courseForm.getRawValue().description,
      startDate: course.startDate,
    };
    this.editMode.set(false);
    this.courseUpdated.emit(newCourse);
  }
}
