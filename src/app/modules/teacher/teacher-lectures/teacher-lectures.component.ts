import {Component, OnInit} from '@angular/core';
import {CourseModel} from '../models/course-model';
import {TeacherCoursesService} from '../teacher-courses/teacher-courses.service';
import {TeacherLectureService} from './teacher-lecture.service';
import {LectureModel} from '../models/lecture-model';
import {MatRadioModule} from '@angular/material/radio';
import {CreateLectureDto} from '../models/create-lecture-dto';

@Component({
  selector: 'cc-teacher-lectures',
  templateUrl: './teacher-lectures.component.html',
  styleUrls: ['./teacher-lectures.component.css']
})
export class TeacherLecturesComponent implements OnInit {
  courses: CourseModel[];
  lectures: LectureModel[];
  teacherId = 1;
  selectedCourse: CourseModel;
  lectureToBeCreated: CreateLectureDto;

  constructor(private teacherCoursesService: TeacherCoursesService,
              private teacherLectureService: TeacherLectureService) {
  }

  ngOnInit(): void {
    this.selectedCourse = new CourseModel({id: 0, lectures: [], name: ''});
    this.lectureToBeCreated = new CreateLectureDto(
      {
        lecture: new LectureModel({id: 0, name: '', description: '', courseId: 0, knowledgeNodeIds: []}),
        teacherId: this.teacherId
      });
    this.teacherCoursesService.getCourses(this.teacherId).toPromise().then(value => {
      this.courses = value;
    });

    this.teacherLectureService.getLectures(this.teacherId).toPromise().then(value => {
      this.lectures = value;
    });
  }

  createLecture(): void {
    this.teacherLectureService.createLecture(this.lectureToBeCreated);
  }

  onCourseSelectionChange(course: CourseModel): void {
    this.selectedCourse = course;
    this.lectureToBeCreated.lecture.courseId = course.id;
  }
}
