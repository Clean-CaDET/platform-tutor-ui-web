import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LearningTask } from '../../learning/task/model/learning-task.model';

@Injectable({ providedIn: 'root' })
export class LearningTasksAuthoringService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'authoring/units/';

  get(unitId: number, id: number): Observable<LearningTask> {
    return this.http.get<LearningTask>(this.baseUrl + unitId + '/learning-tasks/' + id);
  }

  getByUnit(unitId: number): Observable<LearningTask[]> {
    return this.http.get<LearningTask[]>(this.baseUrl + unitId + '/learning-tasks');
  }

  create(unitId: number, task: LearningTask): Observable<LearningTask> {
    return this.http.post<LearningTask>(this.baseUrl + unitId + '/learning-tasks', task);
  }

  clone(unitId: number, task: LearningTask): Observable<LearningTask> {
    return this.http.post<LearningTask>(this.baseUrl + unitId + '/learning-tasks/clone', task);
  }

  move(unitId: number, id: number, destinationUnitId: number): Observable<unknown> {
    return this.http.patch(this.baseUrl + unitId + '/learning-tasks/' + id + '/move', destinationUnitId);
  }

  update(unitId: number, task: LearningTask): Observable<LearningTask> {
    return this.http.put<LearningTask>(this.baseUrl + unitId + '/learning-tasks', task);
  }

  delete(unitId: number, taskId: number): Observable<unknown> {
    return this.http.delete(this.baseUrl + unitId + '/learning-tasks/' + taskId);
  }
}
