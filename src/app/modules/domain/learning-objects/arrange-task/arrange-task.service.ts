import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {AuthenticationService} from '../../../../infrastructure/auth/auth.service';
import {ArrangeTaskContainerSubmission} from './model/arrange-task-container-submission.model';
import {map} from 'rxjs/operators';
import {ArrangeTaskEvaluation} from './model/arrange-task-evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  submitTask(arrangeTaskId: number, containers: ArrangeTaskContainerSubmission[]): Observable<ArrangeTaskEvaluation> {
    return this.http.post(
      environment.apiHost + 'submissions/arrange-task',
      {
        assessmentItemId: arrangeTaskId,
        learnerId: this.authService.user$.value.learnerId,
        containers
      }).pipe(map(data => {
      return new ArrangeTaskEvaluation(data);
    }));
  }
}
