import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(private http: HttpClient) {
  }

  getMaxCorrectness(assessmentItemId: number): Observable<number> {
    return this.http.post(
      environment.apiHost + 'submissions/max-correctness',
      {
        assessmentItemId: assessmentItemId
      })
      .pipe(map(data => +data));
  }
}
