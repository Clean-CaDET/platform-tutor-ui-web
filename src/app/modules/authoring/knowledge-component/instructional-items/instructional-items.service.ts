import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LearningObject } from '../../../learning/knowledge-component/learning-objects/learning-object.model';

@Injectable({
  providedIn: 'root'
})
export class InstructionalItemsService {
  private baseUrl(kcId: number): string {
    return environment.apiHost + 'authoring/knowledge-components/' + kcId + '/instructional-items/';
  }

  constructor(private http: HttpClient) { }

  getAll(kcId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(this.baseUrl(kcId));
  }

  /*create(kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.post<KnowledgeComponent>(this.baseUrl, kc);
  }

  update(kc: KnowledgeComponent): Observable<KnowledgeComponent> {
    return this.http.put<KnowledgeComponent>(this.baseUrl + kc.id, kc);
  }

  delete(kcId: number): Observable<KnowledgeComponent> {
    return this.http.delete<KnowledgeComponent>(this.baseUrl + kcId);
  }*/
}
