import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionStatistics } from './submission-statistics.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubmissionStatisticsService {
  private readonly http = inject(HttpClient);

  getAll(kcId: number, aiId: number): Observable<SubmissionStatistics[]> {
    return this.http.get<SubmissionStatistics[]>(
      `${environment.apiHost}analysis/knowledge-components/${kcId}/assessments/${aiId}`
    );
  }
}
