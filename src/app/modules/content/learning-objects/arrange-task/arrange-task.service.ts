import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LearnerService } from '../../../users/learner.service';
import {ArrangeTaskContainerSubmission} from './model/arrange-task-container-submission.model';
import {ArrangeTaskFeedback} from './model/arrange-task-feedback.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient, private learnerService: LearnerService) { }

  submitTask(nodeId: number, arrangeTaskId: number, containers: ArrangeTaskContainerSubmission[]): Observable<ArrangeTaskFeedback> {
    return this.http.post(
      environment.apiHost + 'submissions/arrange-task',
      {
        assessmentEventId: arrangeTaskId,
        learnerId: this.learnerService.learner$.value.id,
        containers
      }).pipe(map(data => {
        console.log(data);
        return new ArrangeTaskFeedback(data);
    }));
  }
}
