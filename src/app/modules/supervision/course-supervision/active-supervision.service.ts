import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';
import { Group } from '../model/group.model';
import { environment } from 'src/environments/environment';
import { WeeklyFeedbackQuestion } from '../../monitoring/weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../../learning/reflection/reflection.model';

@Injectable({
  providedIn: 'root'
})
export class ActiveSupervisionService {
  baseUrl: string = `${environment.apiHost}supervision/active/`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl);
  }

  GetCourseGroups(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + courseId);
  }

  GetFeedbackQuestions(): Observable<WeeklyFeedbackQuestion[]> {
    return this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`);
  }

  GetReflections(learnerId: number, reflectionIds: number[]): Observable<Reflection[]> {
    const params = reflectionIds.map(id => `reflectionIds=${id}`).join('&');
    return this.http.get<Reflection[]>(`${this.baseUrl}reflections/${learnerId}?${params}`);
  }
}