import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskProgress } from './model/task-progress';
import { LearningTask } from './model/learning-task';
import { StepProgress } from './model/step-progress';
import { Unit } from '../model/unit.model';

@Injectable({
  providedIn: 'root'
})
export class GradingService {
  baseUrl = environment.apiHost + `grading/units/`;

  constructor(private http: HttpClient) { }

  getWeeklyUnits(courseId: number, learnerId: number, weekEnd: Date): Observable<Unit[]> {
    const baseParams = this.createParams(courseId, learnerId, weekEnd);
    return this.http.get<Unit[]>(this.baseUrl, baseParams);
  }

  private createParams(courseId: number, learnerId: number, weekEnd: Date) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('courseId', courseId);
    queryParams = queryParams.append('learnerId', learnerId);
    queryParams = queryParams.append('weekEnd', `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}/${weekEnd.getFullYear()}`);
    return { params: queryParams };
  }

  getTasks(unitId: number): Observable<LearningTask[]> {
    return this.http.get<LearningTask[]>(this.baseUrl + unitId + '/tasks');
  }

  getTaskProgresses(unitId: number, learnerId: number): Observable<TaskProgress[]> {
    return this.http.get<TaskProgress[]>(this.baseUrl + unitId + '/learners/' + learnerId + '/progress');
  }

  submitGrade(unitId: number, progressId: number, stepProgress: StepProgress): Observable<TaskProgress> {
    return this.http.put<TaskProgress>(this.baseUrl + unitId + '/task-progress/' + progressId + '/steps', stepProgress);
  }
}
