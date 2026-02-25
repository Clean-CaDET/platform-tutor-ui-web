import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KnowledgeComponent } from '../model/knowledge-component.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KnowledgeComponentAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/knowledge-components/';

  getByUnit(unitId: number): Observable<KnowledgeComponent[]> {
    const params = new HttpParams().set('unitId', unitId);
    return this.http.get<KnowledgeComponent[]>(environment.apiHost + 'authoring/knowledge-components', { params });
  }

  get(kcId: number): Observable<KnowledgeComponent> {
    return this.http.get<KnowledgeComponent>(this.baseUrl + kcId);
  }

  create(kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.post<KnowledgeComponent>(this.baseUrl, kc);
  }

  update(kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.put<KnowledgeComponent>(this.baseUrl + kc.id, kc);
  }

  delete(kcId: number): Observable<KnowledgeComponent> {
    return this.http.delete<KnowledgeComponent>(this.baseUrl + kcId);
  }
}
