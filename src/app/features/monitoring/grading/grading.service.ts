import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GradingTaskProgress } from './model/grading-progress.model';
import { GradingTask } from './model/grading-task.model';
import { MonitoringUnit } from '../model/unit.model';

@Injectable({ providedIn: 'root' })
export class GradingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'grading/units/';

  getWeeklyUnits(courseId: number, learnerId: number, weekEnd: Date): Observable<MonitoringUnit[]> {
    const params = this.createParams(courseId, learnerId, weekEnd);
    return this.http.get<MonitoringUnit[]>(this.baseUrl, { params });
  }

  private createParams(courseId: number, learnerId: number, weekEnd: Date): HttpParams {
    return new HttpParams()
      .append('courseId', courseId)
      .append('learnerId', learnerId)
      .append('weekEnd', `${weekEnd.getMonth() + 1}/${weekEnd.getDate()}/${weekEnd.getFullYear()}`);
  }

  getTasks(unitId: number): Observable<GradingTask[]> {
    return this.http.get<GradingTask[]>(this.baseUrl + unitId + '/tasks');
  }

  getTaskProgresses(unitId: number, learnerId: number): Observable<GradingTaskProgress[]> {
    return this.http.get<GradingTaskProgress[]>(this.baseUrl + unitId + '/learners/' + learnerId + '/progress');
  }

  submitGrade(unitId: number, progressId: number, stepProgress: unknown): Observable<GradingTaskProgress> {
    return this.http.put<GradingTaskProgress>(this.baseUrl + unitId + '/task-progress/' + progressId + '/steps', stepProgress);
  }

  getGroupSummaries(unitIds: number[], learnerIds: number[]): Observable<GradingTaskProgress[]> {
    return this.http.post<GradingTaskProgress[]>(this.baseUrl + 'group-summaries', { unitIds, learnerIds });
  }
}
