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

  create(kcId: number, item: LearningObject): Observable<LearningObject> {
    return this.http.post<LearningObject[]>(this.baseUrl(kcId), item)
      .pipe(map(instruction => this.learningObjectMapper.convert(instruction)));
  }

  update(kcId: number, item: LearningObject): Observable<LearningObject> {
    return this.http.put<LearningObject[]>(this.baseUrl(kcId)+item.id, item)
      .pipe(map(instruction => this.learningObjectMapper.convert(instruction)));
  }

  updateOrdering(kcId: number, items: LearningObject[]) {
    return this.http.put<LearningObject[]>(this.baseUrl(kcId)+'ordering', items)
      .pipe(map(instruction => this.mapLearningObjects(instruction)));
  }

  delete(kcId: number, itemId: number): Observable<LearningObject> {
    return this.http.delete<LearningObject>(this.baseUrl(kcId)+itemId);
  }
}
