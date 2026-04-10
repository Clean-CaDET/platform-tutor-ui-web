import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ElaborationTask } from './model/elaboration-task.model';

@Injectable({ providedIn: 'root' })
export class ElaborationTaskAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/units/';

  getByUnit(unitId: number): Observable<ElaborationTask[]> {
    return this.http.get<ElaborationTask[]>(this.baseUrl + unitId + '/elaboration-tasks');
  }

  create(unitId: number, task: ElaborationTask): Observable<ElaborationTask> {
    return this.http.post<ElaborationTask>(this.baseUrl + unitId + '/elaboration-tasks', task);
  }

  update(unitId: number, task: ElaborationTask): Observable<ElaborationTask> {
    return this.http.put<ElaborationTask>(this.baseUrl + unitId + '/elaboration-tasks/' + task.id, task);
  }

  delete(unitId: number, taskId: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + unitId + '/elaboration-tasks/' + taskId);
  }
}
