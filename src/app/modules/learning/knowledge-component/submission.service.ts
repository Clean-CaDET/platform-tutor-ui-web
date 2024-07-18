import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from '../model/learning-objects/feedback.model';
import { Submission } from '../model/learning-objects/submission.model';

@Injectable({providedIn: "root"})
export class SubmissionService {
  constructor(private http: HttpClient) {}

  submit(assessmentItemId: number, submission: Submission): Observable<Feedback> {
    return this.http.post<Feedback>(environment.apiHost + 'learning/assessment-item/' +
        assessmentItemId + '/submissions', submission);
  }
}
