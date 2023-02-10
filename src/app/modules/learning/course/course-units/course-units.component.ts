import { Component, Input, OnInit } from '@angular/core';
import { Course } from '../../model/course.model';

@Component({
  selector: 'cc-course-units',
  templateUrl: './course-units.component.html',
  styleUrls: ['./course-units.component.scss'],
})
export class CourseUnitsComponent {
  @Input() course: Course;

  constructor() {}

}
