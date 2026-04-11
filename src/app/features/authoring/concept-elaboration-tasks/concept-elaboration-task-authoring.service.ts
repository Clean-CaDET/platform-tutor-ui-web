import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConceptElaborationTask, ConceptElaborationTaskSummary } from './model/concept-elaboration-task.model';

@Injectable({ providedIn: 'root' })
export class ConceptElaborationTaskAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/units/';

  getByUnit(unitId: number): Observable<ConceptElaborationTaskSummary[]> {
    return this.http.get<ConceptElaborationTaskSummary[]>(this.baseUrl + unitId + '/concept-elaborations');
  }

  get(unitId: number, id: number): Observable<ConceptElaborationTask> {
    return this.http.get<ConceptElaborationTask>(this.baseUrl + unitId + '/concept-elaborations/' + id);
  }

  create(unitId: number, task: ConceptElaborationTask): Observable<ConceptElaborationTask> {
    return this.http.post<ConceptElaborationTask>(this.baseUrl + unitId + '/concept-elaborations', task);
  }

  update(unitId: number, task: ConceptElaborationTask): Observable<ConceptElaborationTask> {
    return this.http.put<ConceptElaborationTask>(this.baseUrl + unitId + '/concept-elaborations/' + task.id, task);
  }

  delete(unitId: number, id: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + unitId + '/concept-elaborations/' + id);
  }
}
