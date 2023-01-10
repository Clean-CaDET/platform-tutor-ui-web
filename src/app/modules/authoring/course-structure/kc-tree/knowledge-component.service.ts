import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KnowledgeComponent } from 'src/app/modules/learning/model/knowledge-component.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeComponentService {

  constructor(private http: HttpClient) { }

  saveKc(unitId: number, kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.post<KnowledgeComponent>(this.baseUrl(unitId), kc);
  }

  updateKc(unitId: number, kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.put<KnowledgeComponent>(this.baseUrl(unitId) + kc.id, kc);
  }

  deleteKc(unitId: number, kcId: number): Observable<KnowledgeComponent> {
    return this.http.delete<KnowledgeComponent>(this.baseUrl(unitId) + kcId);
  }

  private baseUrl(unitId: number): string {
    return environment.apiHost + 'authoring/units/' + unitId + '/knowledge-components/';
  }
}
