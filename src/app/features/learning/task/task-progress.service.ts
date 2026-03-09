import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TaskProgress } from './model/task-progress.model';
import { StepProgress } from './model/step-progress.model';

@Injectable({ providedIn: 'root' })
export class TaskProgressService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiHost + 'learning/units/';

  private stepUrl(unitId: number, taskId: number, progressId: number): string {
    return `${this.baseUrl}${unitId}/learning-tasks/${taskId}/progress/${progressId}/step`;
  }

  get(unitId: number, taskId: number): Observable<TaskProgress> {
    return this.http.get<TaskProgress>(
      `${this.baseUrl}${unitId}/learning-tasks/${taskId}/progress`,
    );
  }

  viewStep(unitId: number, taskId: number, progressId: number, stepId: number): Observable<TaskProgress> {
    return this.http.put<TaskProgress>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}`, {},
    );
  }

  submitAnswer(unitId: number, taskId: number, progressId: number, stepProgress: StepProgress): Observable<TaskProgress> {
    return this.http.post<TaskProgress>(
      `${this.stepUrl(unitId, taskId, progressId)}/`, stepProgress,
    );
  }

  submissionOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/open-submission`, null,
    );
  }

  guidanceOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/open-guidance`, null,
    );
  }

  exampleOpened(unitId: number, taskId: number, progressId: number, stepId: number): Observable<unknown> {
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/open-example`, null,
    );
  }

  exampleVideoPlayed(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl);
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/play-video`, null, { params },
    );
  }

  exampleVideoPaused(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl);
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/pause-video`, null, { params },
    );
  }

  exampleVideoFinished(unitId: number, taskId: number, progressId: number, stepId: number, videoUrl: string): Observable<unknown> {
    const params = new HttpParams().set('videoUrl', videoUrl);
    return this.http.post<unknown>(
      `${this.stepUrl(unitId, taskId, progressId)}/${stepId}/finish-video`, null, { params },
    );
  }
}
