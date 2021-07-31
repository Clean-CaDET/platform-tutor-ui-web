import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateCourseDtoModel} from '../models/create-course-dto-model';
import {environment} from '../../../../environments/environment';
import {CourseModel} from '../models/course-model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherCoursesService {
  constructor(private http: HttpClient) {
  }

  createCourse(course: CreateCourseDtoModel): void {
    this.http.post<CreateCourseDtoModel>(environment.apiHost + 'content/course', course).subscribe(
      data => console.log(data),
      error => alert(error.error),
    )
    ;
  }

  getCourses(teacherId: number): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(environment.apiHost + 'content/course/teacher/' + teacherId.toString());
  }
}
