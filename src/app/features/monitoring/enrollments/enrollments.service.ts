import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Enrollment } from '../model/enrollment.model';
import { MonitoringCourse } from '../model/course.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'monitoring/enrollments/';

  getUnits(courseId: number): Observable<MonitoringCourse> {
    return this.http.get<MonitoringCourse>(environment.apiHost + 'owned-courses/' + courseId);
  }

  get(unitIds: number[], learnerIds: number[]): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl, { unitIds, learnerIds });
  }

  bulkEnroll(unitId: number, learnerIds: number[], newEnrollment: Enrollment): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl + `${unitId}/enroll`, { learnerIds, newEnrollment });
  }

  bulkUnenroll(unitId: number, learnerIds: number[]): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl + `${unitId}/unenroll`, learnerIds);
  }
}
