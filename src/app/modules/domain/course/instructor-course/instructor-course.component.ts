import {Component, OnInit} from '@angular/core';
import {Course} from '../course.model';
import {ActivatedRoute, Params} from '@angular/router';
import {CourseService} from '../course.service';

@Component({
  selector: 'cc-instructor-course',
  templateUrl: './instructor-course.component.html',
  styleUrls: ['./instructor-course.component.scss']
})
export class InstructorCourseComponent implements OnInit {

  course: Course;

  constructor(private route: ActivatedRoute,
              private courseService: CourseService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe(course => this.course = course);
    });
  }
}
