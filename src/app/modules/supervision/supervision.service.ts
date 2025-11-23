import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../learning/model/course.model';
import { Group } from './model/group.model';
import { environment } from 'src/environments/environment';
import { WeeklyFeedbackQuestion } from '../monitoring/weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../learning/reflection/reflection.model';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {
  baseUrl: string = `${environment.apiHost}supervision/`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.baseUrl + 'active');
  }

  GetCourseGroups(courseId: number): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + 'active/' + courseId);
  }

  GetFeedbackQuestions(): Observable<WeeklyFeedbackQuestion[]> {
    return this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`);
  }

  GetReflections(learnerId: number, reflectionIds: number[]): Observable<Reflection[]> {
    const params = reflectionIds.map(id => `reflectionIds=${id}`).join('&');
    return this.http.get<Reflection[]>(`${this.baseUrl}active/reflections/${learnerId}?${params}`);
  }
}
