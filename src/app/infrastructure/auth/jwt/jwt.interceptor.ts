import {HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {TokenService} from './token.service';
import {LearnerService} from '../../../modules/learner/learner.service';
import {AuthenticationResponse} from './authentication-response.model';
import {ACCESS_TOKEN} from '../../../shared/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService, private learnerService: LearnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessTokenRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + window.sessionStorage.getItem(ACCESS_TOKEN)
      }
    });

    return next.handle(accessTokenRequest).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(accessTokenRequest, next);
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
          switchMap((authenticationResponse: AuthenticationResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(authenticationResponse.accessToken);
            return next.handle(JwtInterceptor.addTokenHeader(request, authenticationResponse.accessToken));
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
      switchMap((token) => next.handle(JwtInterceptor.addTokenHeader(request, token)))
    );
  }

  private static addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
  }
}
