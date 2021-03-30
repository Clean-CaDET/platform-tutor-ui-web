import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArrangeTaskService {

  constructor(private http: HttpClient) { }

  submitTask(arrangeTaskId: number, state: any): Observable<any> {
    const answerDTO = {
      arrangeTaskId,
      state
    };
    // TODO: API call to submit a task
    return of(null);
  }
}
