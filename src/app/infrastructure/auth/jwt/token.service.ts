import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AuthenticationResponse} from './authentication-response.model';
import {ACCESS_TOKEN, REFRESH_TOKEN, ROLE} from '../../../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient) {}

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

  public saveAccessToken(token: string): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.setItem(ACCESS_TOKEN, token);
    
    const decodedJwt = JSON.parse(window.atob(token.split('.')[1]));
    localStorage.setItem(ROLE, decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
  }

  public saveRefreshToken(token: string): void {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  public getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken === 'null') {
      return null;
    } else {
      return refreshToken;
    }
  }

  public clear() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(ROLE);
  }
}
