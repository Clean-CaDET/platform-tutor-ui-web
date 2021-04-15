import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../model/container.model';
import { environment } from '../../../../../../environments/environment';
import { TraineeService } from '../../../../../trainee/service/trainee.service';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient, private traineeService: TraineeService) { }

  submitTask(nodeId: number, arrangeTaskId: number, containers: Container[]): Observable<any> {
    return this.http.post(
      environment.apiHost + 'nodes/' + nodeId + '/content/arrange-task',
      {
        arrangeTaskId,
        traineeId: this.traineeService.trainee$.value.id,
        containers
      });
  }
}
