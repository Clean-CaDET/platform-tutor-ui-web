import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { LearningObject, AssessmentItem } from '../model/learning-object.model';
import { KcStatistics } from '../model/kc-statistics.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeComponentService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getKnowledgeComponent(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(`${environment.apiHost}learning/knowledge-component/${kcId}`);
  }

  getSuitableAssessmentItem(kcId: number): Observable<AssessmentItem> {
    const params = new HttpParams().set('aId', this.auth.clientId());
    return this.http.get<AssessmentItem>(`${environment.apiHost}learning/knowledge-component/${kcId}/assessment-item`, { params });
  }

  getAssessmentItems(kcId: number): Observable<AssessmentItem[]> {
    const params = new HttpParams().set('aId', this.auth.clientId());
    return this.http.get<AssessmentItem[]>(`${environment.apiHost}learning/knowledge-component/${kcId}/assessment-item/review`, { params });
  }

  getInstructionalItems(kcId: number): Observable<LearningObject[]> {
    const params = new HttpParams().set('aId', this.auth.clientId());
    return this.http.get<LearningObject[]>(`${environment.apiHost}learning/knowledge-component/${kcId}/instructional-items`, { params });
  }

  getStatistics(kcId: number): Observable<KcStatistics> {
    return this.http.get<KcStatistics>(`${environment.apiHost}learning/statistics/kcm/${kcId}`);
  }

  launchSession(kcId: number): Observable<unknown> {
    return this.http.post(`${environment.apiHost}learning/session/${kcId}/launch`, null);
  }

  terminateSession(kcId: number): Observable<unknown> {
    return this.http.post(`${environment.apiHost}learning/session/${kcId}/terminate`, null);
  }

  abandonSession(kcId: number): Observable<unknown> {
    return this.http.post(`${environment.apiHost}learning/session/${kcId}/abandon`, null);
  }
}
