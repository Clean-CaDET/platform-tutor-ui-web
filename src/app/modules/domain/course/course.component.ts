import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Course} from './course.model';
import {InstructorService} from '../../instructor/instructor.service';

@Component({
  selector: 'cc-course-component',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;

  constructor(private route: ActivatedRoute,
              private instructorService: InstructorService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.instructorService.getCourse(+params.courseId).subscribe(course => this.course = course);
      console.log(this.course);
    });
  }
}
