import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LearningTask } from './model/learning-task';
import { TaskProgressSummary } from '../model/task-progress-summary';

@Injectable({providedIn: "root"})
export class TaskService {

  private baseUrl = environment.apiHost + 'learning/units/';

  constructor(private http: HttpClient) { }

  get(unitId: number, id: number): Observable<LearningTask>{
    return this.http.get<LearningTask>(this.baseUrl + unitId + '/learning-tasks/' + id);
  }

  getByUnit(unitId: number): Observable<TaskProgressSummary[]>{
    return this.http.get<TaskProgressSummary[]>(this.baseUrl + unitId + '/learning-tasks');
  }
}
