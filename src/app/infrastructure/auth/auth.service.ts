import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenStorage } from './jwt/token.service';
import { AuthenticationResponse } from './jwt/authentication-response.model';
import { Router } from '@angular/router';
import { User } from './user.model';
import { FormControl, ɵFormGroupValue, ɵTypedOrUntyped } from '@angular/forms';

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

  login(
    credentialsDto: ɵTypedOrUntyped<
      {
        password: FormControl<string | null>;
        username: FormControl<string | null>;
      },
      ɵFormGroupValue<{
        password: FormControl<string | null>;
        username: FormControl<string | null>;
      }>,
      any
    >
  ): Observable<any> {
    return this.http
      .post<AuthenticationResponse>(
        environment.apiHost + 'users/login',
        credentialsDto
      )
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveTokensAndUser(
            authenticationResponse,
            credentialsDto.username
          );
          this.setUser(this.tokenStorage.getUser());
        })
      );
  }

  setUser(user: User): void {
    if (user.username) {
      this.tokenStorage.saveUser(user.username);
      localStorage.setItem('ON_SUBMIT_CLICKED_COUNTER', String(0));
    } else {
      user = this.tokenStorage.getUser();
    }
    this.user$.next(user);
  }

  logout(): void {
    this.tokenStorage.clear();
    this.user$.next(null);
    this.router.navigate(['home']);
  }
}
