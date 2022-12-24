import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArrangeTaskContainerSubmission } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-container-submission.model';
import { ArrangeTaskEvaluation } from 'src/app/modules/learning/model/learning-objects/arrange-task/arrange-task-evaluation.model';

@Injectable({
  providedIn: 'root',
})
export class ArrangeTaskService {
  constructor(private http: HttpClient) {}

  submitTask(
    arrangeTaskId: number,
    containers: ArrangeTaskContainerSubmission[]
  ): Observable<ArrangeTaskEvaluation> {
    return this.http
      .post<ArrangeTaskEvaluation>(environment.apiHost + 'submissions/arrange-task', {
        assessmentItemId: arrangeTaskId,
        containers,
      });
  }
}
