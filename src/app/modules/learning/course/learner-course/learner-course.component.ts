import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Unit } from '../../unit/unit.model';
import { Course } from '../course.model';
import { LearningService } from '../../learning.service';

@Component({
  selector: 'cc-learner-course',
  templateUrl: './learner-course.component.html',
  styleUrls: ['./learner-course.component.scss'],
})
export class LearnerCourseComponent implements OnInit {
  units: Unit[];
  @Input() course: Course;

  constructor(
    private route: ActivatedRoute,
    private learningService: LearningService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.learningService
        .getUnitsByEnrollmentStatus(+params.courseId)
        .subscribe((units) => (this.units = units));
    });
  }
}
