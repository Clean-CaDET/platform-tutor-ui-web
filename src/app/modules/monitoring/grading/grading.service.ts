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

  getTaskProgresses(unitId: number, learnerId: number): Observable<any> {
    return this.http.get<any>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/learners/' + learnerId + '/progresses');
  }

  submitGrade(unitId: number, progressId: number, stepProgress: any): Observable<any> {
    return this.http.put<any>(environment.apiHost + 'monitoring/units/' + unitId + '/learning-tasks/progresses/' + progressId +'/steps', stepProgress);
  }
}
