import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CourseReport } from '../course-report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiHost}reports/`;

  getMany(learnerIds: number[]): Observable<CourseReport[]> {
    return this.http.post<CourseReport[]>(this.baseUrl + 'query', learnerIds);
  }

  get(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/${learnerId}`);
  }

  saveOrUpdate(report: CourseReport, context?: HttpContext): Observable<CourseReport> {
    if (report.id) {
      return this.http.put<CourseReport>(`${this.baseUrl}${report.courseId}/${report.learnerId}`, report, { context });
    }
    return this.http.post<CourseReport>(`${this.baseUrl}${report.courseId}/${report.learnerId}`, report, { context });
  }

  getAchievements(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/${learnerId}/achievements`);
  }
}
