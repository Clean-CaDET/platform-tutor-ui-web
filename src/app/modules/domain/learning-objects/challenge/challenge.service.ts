import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AuthenticationService} from '../../../../infrastructure/auth/auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  constructor(private http: HttpClient, private authService: AuthenticationService) {
  }

  getMaxCorrectness(assessmentItemId: number): Observable<number> {
    return this.http.post(
      environment.apiHost + 'submissions/max-correctness',
      {
        assessmentItemId: assessmentItemId,
        learnerId: this.authService.user$.value.learnerId
      })
      .pipe(map(data => +data));
  }
}
