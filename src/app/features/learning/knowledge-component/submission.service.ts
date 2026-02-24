import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Submission } from '../model/submission.model';
import { Feedback } from '../model/feedback.model';

@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly http = inject(HttpClient);

  submit(assessmentItemId: number, submission: Submission): Observable<Feedback> {
    return this.http.post<Feedback>(
      `${environment.apiHost}learning/assessment-item/${assessmentItemId}/submissions`,
      submission,
    );
  }
}
