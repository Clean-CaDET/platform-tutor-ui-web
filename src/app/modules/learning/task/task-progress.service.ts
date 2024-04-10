import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskProgressService {

  private baseUrl = environment.apiHost + 'learning/units/';

  constructor(private http: HttpClient) { }

  get(unitId: number, taskId: number): Observable<any>{
    return this.http.get<any>(this.baseUrl + unitId + '/learning-tasks/' + taskId + '/progress');
  }

  viewStep(unitId: number, taskId: number, progressId: number, stepId: number) {
    return this.http.put<any>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId, {});
  }

  submitAnswer(unitId: number, taskId: number, progressId: number, stepProgress: any) {
    return this.http.post<any>(this.baseUrl + unitId + '/learning-tasks/' + taskId + '/progress/' + progressId + '/step/', stepProgress); 
  }
}
