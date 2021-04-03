import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../model/container.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient) { }

  submitTask(nodeId: number, arrangeTaskId: number, state: Container[]): Observable<any> {
    return this.http.post(
      environment.apiHost + 'nodes/' + nodeId + '/content/' + arrangeTaskId,
      state);
  }
}
