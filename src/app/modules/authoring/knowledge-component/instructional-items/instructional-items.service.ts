import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LearningObjectMapper } from 'src/app/modules/learning/knowledge-component/learning-objects/learning-object-mapper';
import { environment } from 'src/environments/environment';
import { LearningObject } from '../../../learning/knowledge-component/learning-objects/learning-object.model';

@Injectable({
  providedIn: 'root'
})
export class InstructionalItemsService {
  private baseUrl(kcId: number): string {
    return environment.apiHost + 'authoring/knowledge-components/' + kcId + '/instruction/';
  }

  constructor(private http: HttpClient, private learningObjectMapper: LearningObjectMapper) { }

  getAll(kcId: number): Observable<LearningObject[]> {
    return this.http.get<LearningObject[]>(this.baseUrl(kcId))
      .pipe(map(instruction => this.mapLearningObjects(instruction)));
  }

  mapLearningObjects(instructionalItems: LearningObject[]): LearningObject[] {
    instructionalItems = instructionalItems.map((ie) =>
      this.learningObjectMapper.convert(ie)
    );
    return instructionalItems;
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
