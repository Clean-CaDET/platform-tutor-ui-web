import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupervisionCourse } from './model/course.model';
import { SupervisionGroup } from './model/group.model';
import { WeeklyFeedbackQuestion } from '../monitoring/weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../learning/reflection/reflection.model';

@Injectable({ providedIn: 'root' })
export class ActiveSupervisionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiHost}supervision/active/`;

  getActiveCourses(): Observable<SupervisionCourse[]> {
    return this.http.get<SupervisionCourse[]>(this.baseUrl);
  }

  getCourseGroups(courseId: number): Observable<SupervisionGroup[]> {
    return this.http.get<SupervisionGroup[]>(this.baseUrl + courseId);
  }

  getFeedbackQuestions(): Observable<WeeklyFeedbackQuestion[]> {
    return this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`);
  }

  getReflections(learnerId: number, reflectionIds: number[]): Observable<Reflection[]> {
    const params = reflectionIds.map(id => `reflectionIds=${id}`).join('&');
    return this.http.get<Reflection[]>(`${this.baseUrl}reflections/${learnerId}?${params}`);
  }
}
