import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeeklyFeedback } from './weekly-feedback.model';

@Injectable({providedIn: "root"})
export class WeeklyFeedbackService {
  private baseLearnerUrl(courseId: number, learnerId: number): string {
    return `${environment.apiHost}monitoring/${courseId}/feedback/${learnerId}/`;
  }

  constructor(private http: HttpClient) { }

  getByCourseAndLearner(courseId: number, learnerId: number): Observable<WeeklyFeedback[]> {
    return this.http.get<WeeklyFeedback[]>(this.baseLearnerUrl(courseId, learnerId))
      .pipe(map(results => {
        results.forEach(r => r.weekEnd = new Date(r.weekEnd));
        return results;
      }));
  }

  getByGroup(courseId: number, learnerIds: number[], weekEnd: Date): Observable<WeeklyFeedback[]> {
    return this.http.post<WeeklyFeedback[]>(`${environment.apiHost}monitoring/${courseId}/feedback`, {learnerIds, weekEnd});
  }

  create(courseId: number, learnerId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.post<WeeklyFeedback>(this.baseLearnerUrl(courseId, learnerId), item);
  }

  update(courseId: number, learnerId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.put<WeeklyFeedback>(this.baseLearnerUrl(courseId, learnerId)+item.id, item);
  }

  delete(courseId: number, learnerId: number, itemId: number): Observable<WeeklyFeedback> {
    return this.http.delete<WeeklyFeedback>(this.baseLearnerUrl(courseId, learnerId)+itemId);
  }
}
