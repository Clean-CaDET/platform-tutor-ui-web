import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthenticationResponse} from './authentication-response.model';
import {ACCESS_TOKEN, REFRESH_TOKEN, USER} from '../../../shared/constants';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {
  constructor(private http: HttpClient) {}

  saveTokensAndUser(authenticationResponse: AuthenticationResponse, username: string) {
    this.saveAccessToken(authenticationResponse.accessToken);
    this.saveRefreshToken(authenticationResponse.refreshToken);
    this.saveUser(username);
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const data = {
      accessToken: localStorage.getItem(ACCESS_TOKEN),
      refreshToken: localStorage.getItem(REFRESH_TOKEN)
    };

    return this.http.post<AuthenticationResponse>(environment.apiHost + 'users/refresh', data)
      .pipe(map(refreshResponse => {
        this.saveAccessToken(refreshResponse.accessToken);
        this.saveRefreshToken(refreshResponse.refreshToken);
        return new AuthenticationResponse(refreshResponse);
      }));
  }

  saveAccessToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken === 'null') {
      return null;
    } else {
      return refreshToken;
    }
  }

  saveUser(username: string) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const decodedJwt = JSON.parse(window.atob(accessToken.split('.')[1]));
    const user = new User({
      id: +decodedJwt.id,
      learnerId: +decodedJwt.learnerId,
      username: username,
      role: decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    })
    localStorage.setItem(USER, JSON.stringify(user));
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem(USER));
  }

  clear() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER);
  }
}
