import {Component, Input, OnInit} from '@angular/core';
import {TeacherCoursesService} from './teacher-courses.service';
import {CreateCourseDtoModel} from '../models/create-course-dto-model';
import {MatTableModule} from '@angular/material/table';
import {CourseModel} from '../models/course-model';

@Component({
  selector: 'cc-teacher-courses',
  templateUrl: './teacher-courses.component.html',
  styleUrls: ['./teacher-courses.component.css']
})
export class TeacherCoursesComponent implements OnInit {
  courseToBeCreated: CreateCourseDtoModel;
  teacherId = 1;
  courseList: CourseModel[];

  constructor(private teacherCoursesService: TeacherCoursesService) {
    this.courseToBeCreated = new CreateCourseDtoModel({teacherId: this.teacherId, course: {name: ''}});
  }

  ngOnInit(): void {
    this.teacherCoursesService.getCourses(this.teacherId).toPromise().then(value => {
      this.courseList = value;
    });
  }

  createCourse(): void {
    this.teacherCoursesService.createCourse(this.courseToBeCreated);
  }

}
