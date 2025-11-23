import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../model/course.model';
import { CourseAchievements } from '../model/course-achievements.model';

@Injectable({
  providedIn: 'root'
})
export class ReportSupervisionService {
  baseUrl: string = `${environment.apiHost}supervision/reporting/`;

  constructor(private http: HttpClient) { }

  GetStartedCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  GetCourseWithGroupsAndUnits(courseId: number): Observable<Course> {
    return this.http.get<Course>(this.baseUrl + courseId);
  }

  GetAchievements(courseId: number, learnerId: number): Observable<CourseAchievements> {
    return this.http.get<CourseAchievements>(`${this.baseUrl}${courseId}/achievements/${learnerId}`);
  }
}