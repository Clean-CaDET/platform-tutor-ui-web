import {Injectable} from '@angular/core';
import {Learner} from './learner.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {tap} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenService} from '../../infrastructure/auth/jwt/token.service';
import {AuthenticationResponse} from '../../infrastructure/auth/jwt/authentication-response.model';

interface LoginDTO {
  index: string;
}

interface RegisterDTO {
  index: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  learner$ = new BehaviorSubject(null);

  constructor(private http: HttpClient, private tokenStorage: TokenService) {
  }

  login(loginDTO: LoginDTO): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(environment.apiHost + 'learners/login', loginDTO)
      .pipe(tap(authenticationResponse => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.tokenStorage.saveRefreshToken(authenticationResponse.refreshToken);
        const learner = new Learner({id: authenticationResponse.id});
        this.setLearner(learner);
      }));
  }

  register(registerDTO: RegisterDTO): Observable<any> { // TODO: Check if <any> is ok. I put <any> instead of <AuthenticationResponse> because Tutor sends back Task<> instead of ActionResponse<>.
    return this.http.post<any>(environment.apiHost + 'learners/register', registerDTO)
      .pipe(tap(registrationResponse => {
        this.tokenStorage.saveAccessToken(registrationResponse.value.accessToken);
        this.tokenStorage.saveRefreshToken(registrationResponse.value.refreshToken);
        const learner = new Learner({id: registrationResponse.value.id});
        this.setLearner(learner);
      }));
  }

  setLearner(learner: Learner): void {
    this.learner$.next(learner);
  }

  logout(): void {
    this.learner$.next(null);
    localStorage.setItem('auth-token', null);
    localStorage.setItem('auth-refresh-token', null);
  }
}
