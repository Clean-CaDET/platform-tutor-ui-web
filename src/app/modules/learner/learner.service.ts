import {Injectable} from '@angular/core';
import {Learner} from './learner.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {switchMap, tap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenService} from '../../infrastructure/auth/jwt/token.service';
import {AuthenticationResponse} from '../../infrastructure/auth/jwt/authentication-response.model';
import {Router} from '@angular/router';

interface LoginDTO {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  learner$ = new BehaviorSubject(null);

  constructor(private http: HttpClient, private tokenStorage: TokenService, private router: Router) {
  }

  login(loginDTO: LoginDTO): Observable<any> {
    return this.http.post<AuthenticationResponse>(environment.apiHost + 'users/login', loginDTO)
      .pipe(tap(authenticationResponse => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.tokenStorage.saveRefreshToken(authenticationResponse.refreshToken);
      }), switchMap(() => this.http.get<Learner>(environment.apiHost + 'learners/profile').pipe((tap(learnerInfo => {
        const learner = new Learner({id: learnerInfo.id, index: learnerInfo.index, name: learnerInfo.name});
        this.setLearner(learner);
      })))));
  }

  setLearner(learner: Learner): void {
    if (learner.index) {
      localStorage.setItem('STUDENT', JSON.stringify(learner));
      localStorage.setItem('ON_SUBMIT_CLICKED_COUNTER', String(0));
    } else {
      learner.index = JSON.parse(localStorage.getItem('STUDENT')).index;
    }
    this.learner$.next(learner);
  }

  logout(): void {
    this.tokenStorage.clear();
    localStorage.setItem('STUDENT', null);
    this.learner$.next(null);
    this.router.navigate(['home']);
  }
}
