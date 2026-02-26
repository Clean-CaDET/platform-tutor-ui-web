import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupervisionCourse } from './model/course.model';
import { SupervisionGroup } from './model/group.model';

@Injectable({ providedIn: 'root' })
export class ReportSupervisionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiHost}supervision/reporting/`;

  getStartedCourses(): Observable<SupervisionCourse[]> {
    return this.http.get<SupervisionCourse[]>(this.baseUrl);
  }

  getGroupedLearners(courseId: number): Observable<SupervisionGroup[]> {
    return this.http.get<SupervisionGroup[]>(this.baseUrl + courseId);
  }
}
