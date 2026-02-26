import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WeeklyFeedback } from './weekly-feedback.model';

@Injectable({ providedIn: 'root' })
export class WeeklyFeedbackService {
  private readonly http = inject(HttpClient);

  readonly weeklyFeedbackObserver = new Subject<WeeklyFeedback | null>();

  notify(feedback: WeeklyFeedback | null): void {
    this.weeklyFeedbackObserver.next(feedback);
  }

  private baseLearnerUrl(courseId: number): string {
    return `${environment.apiHost}monitoring/${courseId}/feedback/`;
  }

  getByCourseAndLearner(courseId: number, learnerId: number): Observable<WeeklyFeedback[]> {
    const params = new HttpParams().set('learnerId', learnerId.toString());
    return this.http.get<WeeklyFeedback[]>(this.baseLearnerUrl(courseId), { params })
      .pipe(map(results => {
        results.forEach(r => {
          r.weekEnd = new Date(r.weekEnd);
        });
        results.sort((a, b) => new Date(a.weekEnd).getTime() - new Date(b.weekEnd).getTime());
        return results;
      }));
  }

  getByGroup(courseId: number, learnerIds: number[], weekEnd: Date): Observable<WeeklyFeedback[]> {
    return this.http.post<WeeklyFeedback[]>(`${environment.apiHost}monitoring/${courseId}/feedback/group`, { learnerIds, weekEnd });
  }

  create(courseId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.post<WeeklyFeedback>(this.baseLearnerUrl(courseId), { ...item, opinions: item.opinions });
  }

  update(courseId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    return this.http.put<WeeklyFeedback>(this.baseLearnerUrl(courseId) + item.id, { ...item, opinions: item.opinions });
  }

  delete(courseId: number, itemId: number): Observable<WeeklyFeedback> {
    return this.http.delete<WeeklyFeedback>(this.baseLearnerUrl(courseId) + itemId);
  }
}
