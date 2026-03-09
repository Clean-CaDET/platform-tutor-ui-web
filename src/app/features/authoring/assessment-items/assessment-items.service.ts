import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthoringAssessmentItem } from './model/assessment-item.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AssessmentItemsService {
  private readonly http = inject(HttpClient);

  private baseUrl(kcId: number): string {
    return `${environment.apiHost}authoring/knowledge-components/${kcId}/assessments/`;
  }

  getAll(kcId: number): Observable<AuthoringAssessmentItem[]> {
    return this.http.get<AuthoringAssessmentItem[]>(this.baseUrl(kcId));
  }

  create(kcId: number, item: AuthoringAssessmentItem): Observable<AuthoringAssessmentItem> {
    return this.http.post<AuthoringAssessmentItem>(this.baseUrl(kcId), item);
  }

  update(kcId: number, item: AuthoringAssessmentItem): Observable<AuthoringAssessmentItem> {
    return this.http.put<AuthoringAssessmentItem>(this.baseUrl(kcId) + item.id, item);
  }

  updateOrdering(kcId: number, items: AuthoringAssessmentItem[]): Observable<AuthoringAssessmentItem[]> {
    return this.http.put<AuthoringAssessmentItem[]>(this.baseUrl(kcId) + 'ordering', items);
  }

  delete(kcId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl(kcId) + itemId);
  }
}
