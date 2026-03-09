import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LearningTask } from './model/learning-task.model';
import { TaskProgressSummary } from '../model/task-progress-summary.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'learning/units/';

  get(unitId: number, id: number): Observable<LearningTask> {
    return this.http.get<LearningTask>(`${this.baseUrl}${unitId}/learning-tasks/${id}`);
  }

  getByUnit(unitId: number): Observable<TaskProgressSummary[]> {
    return this.http.get<TaskProgressSummary[]>(`${this.baseUrl}${unitId}/learning-tasks`);
  }
}
