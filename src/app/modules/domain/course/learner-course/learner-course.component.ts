import {Component, Input, OnInit} from '@angular/core';
import {CourseService} from '../course.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Unit} from '../../unit/unit.model';
import {Course} from '../course.model';

@Component({
  selector: 'cc-learner-course',
  templateUrl: './learner-course.component.html',
  styleUrls: ['./learner-course.component.scss']
})
export class LearnerCourseComponent implements OnInit {

  units: Unit[];
  @Input() course: Course;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getUnitsByEnrollmentStatus(+params.courseId).subscribe(units => this.units = units);
    });
  }
}
