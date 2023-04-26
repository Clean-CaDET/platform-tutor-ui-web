import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Course } from '../learning/model/course.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private http: HttpClient) {}

  getLearnerCourses(): Observable<PagedResults<Course>> {
    return this.http.get<PagedResults<Course>>(environment.apiHost + 'enrolled-courses');
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(environment.apiHost + 'owned-courses');
  }
}
