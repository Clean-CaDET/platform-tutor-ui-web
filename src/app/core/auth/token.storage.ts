import { Injectable } from '@angular/core';

const ACCESS_TOKEN = 'access-token';
const REFRESH_TOKEN = 'refresh-token';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  saveAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  saveRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  }
}
