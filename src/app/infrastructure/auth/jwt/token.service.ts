import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthenticationResponse} from './authentication-response.model';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient) {
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const data = {
      accessToken: window.sessionStorage.getItem(ACCESS_TOKEN),
      refreshToken: window.sessionStorage.getItem(REFRESH_TOKEN)
    };

    return this.http.post<AuthenticationResponse>(environment.apiHost + 'learners/refresh', data)
      .pipe(map(refreshResponse => {
        this.saveAccessToken(refreshResponse.accessToken);
        this.saveRefreshToken(refreshResponse.refreshToken);
        return new AuthenticationResponse(refreshResponse);
      }));
  }

  public saveAccessToken(token: string): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN);
    window.sessionStorage.setItem(ACCESS_TOKEN, token);
  }

  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    window.sessionStorage.setItem(REFRESH_TOKEN, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN);
  }
}
