import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorage } from './jwt/token.service';
import { AuthenticationResponse } from './jwt/authentication-response.model';
import { Router } from '@angular/router';
import { User } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user$ = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router
  ) {}

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.tokenStorage.saveRefreshToken(
            authenticationResponse.refreshToken
          );
          this.setUser();
        })
      );
  }

  logout(): void {
    this.router.navigate(['/login']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next(null);
      }
    );
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken === null) {
      return;
    }
    this.setUser();
  }

  setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken();
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
      role: jwtHelperService.decodeToken(accessToken)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
    };
    this.user$.next(user);
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const data = {
      accessToken: this.tokenStorage.getAccessToken(),
      refreshToken: this.tokenStorage.getRefreshToken(),
    };

    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/refresh', data)
      .pipe(
        map((refreshResponse) => {
          this.tokenStorage.saveAccessToken(refreshResponse.accessToken);
          this.tokenStorage.saveRefreshToken(refreshResponse.refreshToken);
          const authenticationResponse: AuthenticationResponse = {
            id: refreshResponse.id,
            accessToken: refreshResponse.accessToken,
            refreshToken: refreshResponse.refreshToken,
          };
          return authenticationResponse;
        })
      );
  }
}
