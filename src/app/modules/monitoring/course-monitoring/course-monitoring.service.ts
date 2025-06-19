import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { environment } from 'src/environments/environment';
import { WeeklyFeedbackQuestion } from '../weekly-feedback/weekly-feedback-questions.service';

@Injectable({
  providedIn: 'root'
})
export class CourseMonitoringService {
  baseUrl: string = `${environment.apiHost}monitoring/`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl + 'overview');
  }

  GetCourseGroups(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + 'overview/' + courseId);
  }

  GetFeedbackQuestions(): Observable<WeeklyFeedbackQuestion[]> {
    return this.http.get<WeeklyFeedbackQuestion[]>(this.baseUrl + 'feedback-questions');
  }
}
