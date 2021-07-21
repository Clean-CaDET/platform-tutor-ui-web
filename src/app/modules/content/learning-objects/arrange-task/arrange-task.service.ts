import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from './model/container.model';
import { environment } from '../../../../../environments/environment';
import { LearnerService } from '../../../users/learner.service';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient, private learnerService: LearnerService) { }

  submitTask(nodeId: number, arrangeTaskId: number, containers: Container[]): Observable<any> {
    return this.http.post(
      environment.apiHost + 'submissions/arrange-task',
      {
        arrangeTaskId,
        learnerId: this.learnerService.learner$.value.id,
        containers
      });
  }
}
