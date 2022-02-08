import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {AuthenticationResponse} from './authentication-response.model';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'auth-refresh-token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private http: HttpClient) {
  }

  refreshToken(): any {
    const data = {
      accessToken: window.sessionStorage.getItem('auth-token'),
      refreshToken: window.sessionStorage.getItem('auth-refresh-token')
    };

    return this.http.post<AuthenticationResponse>(environment.apiHost + 'learners/refresh', data)
      .pipe(map(refreshResponse => {
        return new AuthenticationResponse(refreshResponse);
      }));
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
