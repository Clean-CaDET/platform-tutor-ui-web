import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Enrollment } from '../../model/learner-enrollment.model';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  constructor(private http: HttpClient) {}

  private baseUrl(unitId: number) {
    return environment.apiHost + `monitoring/enrollments/unit/${unitId}/`;
  }

  getEnrollments(unitId: number, learnerIds: number[]): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl(unitId) + 'all', learnerIds);
  }

  bulkEnroll(unitId: number, learnerIds: number[], start: Date): Observable<Enrollment[]> {
    return this.http.post<Enrollment[]>(this.baseUrl(unitId) + 'bulk', {learnerIds, start});
  }

  enroll(unitId: number, learnerId: number, start: Date): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.baseUrl(unitId), {learnerIds: [learnerId], start});
  }

  unenroll(unitId: number, learnerId: number) {
    return this.http.delete(this.baseUrl(unitId) + learnerId);
  }

  bulkUnenroll(unitId: number, learnerIds: number[]) {
    return this.http.post<Enrollment[]>(this.baseUrl(unitId) + 'bulk-unenroll', learnerIds);
  }
}
