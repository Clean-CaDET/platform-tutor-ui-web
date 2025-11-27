import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CourseReport } from '../course-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = `${environment.apiHost}reports/`;

  constructor(private http: HttpClient) { }

  getMany(learnerIds: number[]): Observable<CourseReport[]> {
    return this.http.post<CourseReport[]>(this.baseUrl, learnerIds);
  }

  get(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/${learnerId}`);
  }

  saveOrUpdate(report: CourseReport): Observable<CourseReport> {
    if (report.id) {
      return this.http.put<CourseReport>(`${this.baseUrl}${report.courseId}/${report.learnerId}`, report);
    }
    return this.http.post<CourseReport>(`${this.baseUrl}${report.courseId}/${report.learnerId}`, report);
  }

  getAchievements(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/${learnerId}/achievements`);
  }
}