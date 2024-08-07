import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: "root"})
export class KnowledgeComponentService {
  private baseUrl = environment.apiHost + 'authoring/knowledge-components/';

  constructor(private http: HttpClient) { }

  getByUnit(unitId: number): Observable<KnowledgeComponent[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('unitId', unitId);
    return this.http.get<KnowledgeComponent[]>(environment.apiHost + 'authoring/knowledge-components', { params: queryParams });
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
