import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ConceptRecord } from './model/concept-record.model';

@Injectable({ providedIn: 'root' })
export class ConceptRecordAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/courses/';

  getByCourse(courseId: number): Observable<ConceptRecord[]> {
    return this.http.get<ConceptRecord[]>(this.baseUrl + courseId + '/concept-records');
  }

  get(courseId: number, id: number): Observable<ConceptRecord> {
    return this.http.get<ConceptRecord>(this.baseUrl + courseId + '/concept-records/' + id);
  }

  create(courseId: number, record: ConceptRecord): Observable<ConceptRecord> {
    return this.http.post<ConceptRecord>(this.baseUrl + courseId + '/concept-records', record);
  }

  update(courseId: number, record: ConceptRecord): Observable<ConceptRecord> {
    return this.http.put<ConceptRecord>(this.baseUrl + courseId + '/concept-records/' + record.id, record);
  }

  delete(courseId: number, id: number, context?: HttpContext): Observable<unknown> {
    return this.http.delete(this.baseUrl + courseId + '/concept-records/' + id, { context });
  }
}
