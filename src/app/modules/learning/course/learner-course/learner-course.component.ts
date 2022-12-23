import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Course } from '../../model/course.model';

@Component({
  selector: 'cc-learner-course',
  templateUrl: './learner-course.component.html',
  styleUrls: ['./learner-course.component.scss'],
})
export class LearnerCourseComponent implements OnInit {
  @Input() course: Course;

  constructor() {}

  ngOnInit(): void {
  }
}
