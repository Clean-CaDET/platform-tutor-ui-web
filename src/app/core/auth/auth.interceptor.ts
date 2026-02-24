import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, share, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenStorage } from './token.storage';
import { AuthService } from './auth.service';
import { AuthenticationResponse } from './model/authentication-response.model';

let refreshInFlight$: Observable<AuthenticationResponse> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const authService = inject(AuthService);

  const isApiRequest = req.url.startsWith(environment.apiHost);
  const token = tokenStorage.getAccessToken();
  const authReq =
    token && isApiRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        isApiRequest &&
        authService.user() !== null
      ) {
        if (!refreshInFlight$) {
          refreshInFlight$ = authService.refreshToken().pipe(
            share({
              resetOnComplete: true,
              resetOnError: true,
              resetOnRefCountZero: true,
            })
          );
          refreshInFlight$.subscribe({
            complete: () => (refreshInFlight$ = null),
            error: () => (refreshInFlight$ = null),
          });
        }

        return refreshInFlight$.pipe(
          switchMap((response) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.accessToken}` },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
