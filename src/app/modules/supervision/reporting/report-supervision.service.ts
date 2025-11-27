import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course.model';
import { Group } from '../model/group.model';

@Injectable({
  providedIn: 'root'
})
export class ReportSupervisionService {
  baseUrl: string = `${environment.apiHost}supervision/reporting/`;

  constructor(private http: HttpClient) { }

  GetStartedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  GetGroupedLearners(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + courseId);
  }
}