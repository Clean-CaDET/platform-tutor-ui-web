import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course.model';
import { CourseReport } from '../model/course-report.model';
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

  GetAchievements(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/generate/${learnerId}`);
  }

  GetReport(courseId: number, learnerId: number): Observable<CourseReport> {
    return this.http.get<CourseReport>(`${this.baseUrl}${courseId}/report/${learnerId}`);
  }

  SaveOrUpdateReport(report: CourseReport): Observable<CourseReport> {
    if (report.id) {
      return this.http.put<CourseReport>(`${this.baseUrl}${report.courseId}/report/${report.learnerId}`, report);
    }
    return this.http.post<CourseReport>(`${this.baseUrl}${report.courseId}/report/${report.learnerId}`, report);
  }
}