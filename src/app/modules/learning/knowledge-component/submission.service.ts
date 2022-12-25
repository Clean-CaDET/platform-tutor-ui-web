import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Evaluation } from '../model/learning-objects/evaluation.model';
import { Submission } from '../model/learning-objects/submission.model';

@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  submit(
    assessmentItemId: number,
    submission: Submission
  ): Observable<Evaluation> {
    return this.http.post<Evaluation>(
      environment.apiHost +
        'learning/assessment-item/' +
        assessmentItemId +
        '/submissions',
      submission
    );
  }
}
