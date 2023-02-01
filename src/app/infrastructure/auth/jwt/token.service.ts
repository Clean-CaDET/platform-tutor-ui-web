import { Injectable } from '@angular/core';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from '../../../shared/constants';
import { User } from '../user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationResponse } from './authentication-response.model';

@Injectable({
  providedIn: 'root',
})
export class TokenStorage {
  constructor() {}

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
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clear() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER);
  }
}
