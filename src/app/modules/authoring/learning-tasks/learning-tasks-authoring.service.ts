import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LearningTask } from './model/learning-task';

@Injectable({providedIn: "root"})
export class LearningTasksService {
  private baseUrl = environment.apiHost + 'authoring/units/';

  constructor(private http: HttpClient) { }

  get(unitId: number, id: number): Observable<LearningTask>{
    return this.http.get<LearningTask>(this.baseUrl + unitId + '/learning-tasks/' + id);
  }

  getByUnit(unitId: number): Observable<LearningTask[]> {
    return this.http.get<LearningTask[]>(this.baseUrl + unitId + '/learning-tasks');
  }

  create(unitId: number, learningTask: LearningTask) {
    return this.http.post<LearningTask>(this.baseUrl + unitId + '/learning-tasks', learningTask);
  }

  clone(unitId: number, learningTask: LearningTask) {
    return this.http.post<LearningTask>(this.baseUrl + unitId + '/learning-tasks/clone', learningTask);
  }

  move(unitId: number, id: number, destinationUnitId: any) {
    return this.http.patch(this.baseUrl + unitId + '/learning-tasks/' + id + '/move', destinationUnitId);
  }
  
  update(unitId: number, learningTask: LearningTask) {
    return this.http.put<LearningTask>(this.baseUrl + unitId + '/learning-tasks', learningTask);
  }

  delete(unitId: number, learningTaskId: number) {
    return this.http.delete<LearningTask>(this.baseUrl + unitId + '/learning-tasks/' + learningTaskId);
  }
}
