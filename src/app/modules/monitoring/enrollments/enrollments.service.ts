import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Enrollment } from '../model/enrollment.model';
import { Course } from '../model/course.model';

@Injectable({providedIn: "root"})
export class EnrollmentsService {
  baseUrl = environment.apiHost + `monitoring/enrollments/`;
  
  constructor(private http: HttpClient) {}

  getUnits(courseId: number): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'owned-courses/' + courseId);
  }

  get(unitIds: number[], learnerIds: number[]): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl, {unitIds, learnerIds});
  }

  bulkEnroll(unitId: number, learnerIds: number[], newEnrollment: Enrollment): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl + `${unitId}/enroll`, {learnerIds, newEnrollment: newEnrollment});
  }

  bulkUnenroll(unitId: number, learnerIds: number[]) {
    return this.http.post<Enrollment[]>(this.baseUrl + `${unitId}/unenroll`, learnerIds);
  }
}
