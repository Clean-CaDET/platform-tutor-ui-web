import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: "root"})
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

  submissionOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/open-submission', null)
  }

  guidanceOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/open-guidance', null)
  }

  exampleOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/open-example', null)
  }

  exampleVideoPlayed(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl)
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/play-video', null,
      { params }
    )
  }

  exampleVideoPaused(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl)
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/pause-video', null,
      { params }
    )
  }

  exampleVideoFinished(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl)
    return this.http.post<unknown>(this.baseUrl + unitId + '/learning-tasks/' + taskId +'/progress/' + progressId + '/step/' + stepId + '/finish-video', null,
      { params }
    )
  }
}
