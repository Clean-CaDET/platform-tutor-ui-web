import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradingService {

  constructor(private http: HttpClient) { }

  getTasks(unitId: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks');
  }

  getTaskProgress(unitId: number, taskId: any, learnerId: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/' + taskId + '/learners/' + learnerId + '/progress');
  }

  submitGrade(unitId: number, progressId: number, stepProgress: any): Observable<any> {
    return this.http.put<any>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/progress/' + progressId +'/step', stepProgress);
  }
}
