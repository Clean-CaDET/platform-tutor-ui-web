import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from './token.storage';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Login } from './model/login.model';
import { decodeJwt, isTokenExpired } from './jwt.util';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly clientId = signal<string>('');

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((response) => {
          this.tokenStorage.saveAccessToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.setUser();
        })
      );
  }

  logout(): void {
    this.router.navigate(['/login']).then(() => {
      this.tokenStorage.clear();
      this.user.set(null);
    });
  }

  checkIfUserExists(): Promise<void> {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken === null) return Promise.resolve();
    if (isTokenExpired(accessToken)) {
      const refreshToken = this.tokenStorage.getRefreshToken();
      if (refreshToken) {
        return firstValueFrom(this.refreshToken())
          .then(() => this.setUser())
          .catch(() => this.logout());
      }
      this.tokenStorage.clear();
      return Promise.resolve();
    }
    this.setUser();
    return Promise.resolve();
  }

  setUser(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (!accessToken) return;
    const decoded = decodeJwt<Record<string, string>>(accessToken);
    this.user.set({
      id: +decoded['id'],
      username: decoded['username'],
      role: decoded[ROLE_CLAIM],
    });
  }

  refreshToken(): Observable<AuthenticationResponse> {
    const data = {
      accessToken: this.tokenStorage.getAccessToken(),
      refreshToken: this.tokenStorage.getRefreshToken(),
    };
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/refresh', data)
      .pipe(
        tap((response) => {
          this.tokenStorage.saveAccessToken(response.accessToken);
          this.tokenStorage.saveRefreshToken(response.refreshToken);
          this.setUser();
        })
      );
  }
}
