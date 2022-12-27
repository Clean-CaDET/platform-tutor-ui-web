import { Component, Input } from '@angular/core';
import { Course } from 'src/app/modules/learning/model/course.model';

@Component({
  selector: 'cc-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent {
  @Input() course: Course;

  constructor() { }
}
