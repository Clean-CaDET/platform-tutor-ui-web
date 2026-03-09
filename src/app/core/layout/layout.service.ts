import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course } from '../../shared/model/course.model';
import { PagedResults } from '../../shared/model/paged-results.model';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly http = inject(HttpClient);

  getLearnerCourses(): Observable<PagedResults<Course>> {
    return this.http.get<PagedResults<Course>>(environment.apiHost + 'enrolled-courses');
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(environment.apiHost + 'owned-courses');
  }
}
