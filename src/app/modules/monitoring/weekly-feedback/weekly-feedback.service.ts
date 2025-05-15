import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeeklyFeedback } from './weekly-feedback.model';

@Injectable({providedIn: "root"})
export class WeeklyFeedbackService {
  weeklyFeedbackObserver: Subject<WeeklyFeedback> = new Subject();

  notify(feedback: WeeklyFeedback): void {
    this.weeklyFeedbackObserver.next(feedback);
  }

  constructor(private http: HttpClient) { }

  private baseLearnerUrl(courseId: number): string {
    return `${environment.apiHost}monitoring/${courseId}/feedback/`;
  }

  getByCourseAndLearner(courseId: number, learnerId: number): Observable<WeeklyFeedback[]> {
    const params = new HttpParams().set('learnerId', learnerId.toString());
    
    return this.http.get<WeeklyFeedback[]>(this.baseLearnerUrl(courseId), { params })
      .pipe(map(results => {
        results.forEach(r => {
          r.weekEnd = new Date(r.weekEnd);
          if(r.opinions) r.opinions = JSON.parse(r.opinions.toString());
        });
        return results;
      }));
  }

  getByGroup(courseId: number, learnerIds: number[], weekEnd: Date): Observable<WeeklyFeedback[]> { // POST because of many Ids
    return this.http.post<WeeklyFeedback[]>(`${environment.apiHost}monitoring/${courseId}/feedback/group`, {learnerIds, weekEnd});
  }

  create(courseId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    const payload = { ...item, opinions: item.opinions ? JSON.stringify(item.opinions) : null };
    return this.http.post<WeeklyFeedback>(this.baseLearnerUrl(courseId), payload);
  }

  update(courseId: number, item: WeeklyFeedback): Observable<WeeklyFeedback> {
    const payload = { ...item, opinions: item.opinions ? JSON.stringify(item.opinions) : null };
    return this.http.put<WeeklyFeedback>(this.baseLearnerUrl(courseId)+item.id, payload);
  }

  delete(courseId: number, itemId: number): Observable<WeeklyFeedback> {
    return this.http.delete<WeeklyFeedback>(this.baseLearnerUrl(courseId)+itemId);
  }
}
