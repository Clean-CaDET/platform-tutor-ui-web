import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseMonitoringService {
  baseUrl: string = `${environment.apiHost}monitoring/overview`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  GetCourseGroups(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + '/' + courseId);
  }
}
