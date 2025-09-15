import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../management/model/course.model';
import { Group } from '../model/group.model';
import { environment } from 'src/environments/environment';
import { WeeklyFeedbackQuestion } from '../weekly-feedback/weekly-feedback-questions.service';
import { Reflection } from '../../learning/reflection/reflection.model';

@Injectable({
  providedIn: 'root'
})
export class CourseMonitoringService {
  adminUrl: string = `${environment.apiHost}monitoring/overview`;
  instructorUrl: string = `${environment.apiHost}monitoring/courses`;

  constructor(private http: HttpClient) { }

  GetActiveCourses(isInstructor: boolean): Observable<Course[]> {
    return this.http.get<Course[]>(isInstructor ? this.instructorUrl : this.adminUrl);
  }

  GetCourseGroups(courseId: number, isInstructor: boolean): Observable<Group[]> {
    return this.http.get<Group[]>((isInstructor ? this.instructorUrl : this.adminUrl) + '/' + courseId);
  }

  GetFeedbackQuestions(): Observable<WeeklyFeedbackQuestion[]> {
    return this.http.get<WeeklyFeedbackQuestion[]>(`${environment.apiHost}monitoring/feedback-questions`);
  }
  // TODO: Add endpoint for instructor access to reflections, ensuring authorized access
  GetReflections(learnerId: number, reflectionIds: number[]): Observable<Reflection[]> {
    const params = reflectionIds.map(id => `reflectionIds=${id}`).join('&');
    return this.http.get<Reflection[]>(`${environment.apiHost}monitoring/overview/reflections/${learnerId}?${params}`);
  }
}
