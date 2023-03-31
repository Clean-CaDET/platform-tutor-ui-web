import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getCourse(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'enrolled-courses/' + courseId);
  }

  getMasteredUnitIds(unitIds: number[]) {
    return this.http.post<number[]>(environment.apiHost + 'learning/units/mastered', unitIds);
  }
}
