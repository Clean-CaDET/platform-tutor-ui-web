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
  adminUrl: string = `${environment.apiHost}monitoring/overview`;
  instructorUrl: string = `${environment.apiHost}monitoring/courses`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(isInstructor: boolean): Observable<Course[]> {
    return this.http.get<Course[]>(isInstructor ? this.instructorUrl : this.adminUrl);
  }

  GetCourseGroups(courseId: number, isInstructor: boolean): Observable<Group[]> {
    return this.http.get<Group[]>((isInstructor ? this.instructorUrl : this.adminUrl) + '/' + courseId);
  }
}
