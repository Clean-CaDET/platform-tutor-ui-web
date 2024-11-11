import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Course } from '../model/course.model';
import { CourseService } from './course.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'cc-course-component',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
  course: Course;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService
        .getCourse(+params.courseId)
        .subscribe(course => {
          this.course = course;
          this.course.knowledgeUnits = this.course.knowledgeUnits.sort((a, b) => a.order - b.order);
          this.title.setTitle("Tutor - " + course.name);
        });
    });
  }
}
