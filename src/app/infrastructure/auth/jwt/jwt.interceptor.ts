import {HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {TokenStorageService} from './token.service';
import {LearnerService} from '../../../modules/learner/learner.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenStorageService, private learnerService: LearnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + window.sessionStorage.getItem('auth-token')
      }
    });

    return next.handle(authRequest).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(authRequest, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (this.tokenService.getRefreshToken()) {
        return this.tokenService.refreshToken().pipe(
          switchMap((refreshedToken: any) => {
            this.isRefreshing = false;

            this.tokenService.saveToken(refreshedToken.accessToken);
            this.refreshTokenSubject.next(refreshedToken.accessToken);

            return next.handle(this.addTokenHeader(request, refreshedToken.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.learnerService.logout();
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
  }
}
