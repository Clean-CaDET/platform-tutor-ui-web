import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeeklyFeedback } from './weekly-feedback.model';

@Injectable({providedIn: "root"})
export class WeeklyFeedbackService {
  private baseUrl(courseId: number, learnerId: number): string {
    return `${environment.apiHost}monitoring/${courseId}/feedback/${learnerId}/`;
  }

  constructor(private http: HttpClient) { }

  getByCourseAndLearner(courseId: number, learnerId: number): Observable<WeeklyFeedback[]> {
    return this.http.get<WeeklyFeedback[]>(this.baseUrl(courseId, learnerId));
  }

  create(courseId: number, learnerId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.post<WeeklyFeedback>(this.baseUrl(courseId, learnerId), item);
  }

  update(courseId: number, learnerId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.put<WeeklyFeedback>(this.baseUrl(courseId, learnerId)+item.id, item);
  }

  delete(courseId: number, learnerId: number, itemId: number): Observable<WeeklyFeedback> {
    return this.http.delete<WeeklyFeedback>(this.baseUrl(courseId, learnerId)+itemId);
  }
}
