import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Course } from '../../../../learning/course/course.model';

@Component({
  selector: 'cc-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent implements OnInit {
  @Input() course: Course;
  @Input() user: User;

  constructor() {}

  ngOnInit(): void {}
}
