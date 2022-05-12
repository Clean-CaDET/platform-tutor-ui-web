import {HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {TokenService} from './token.service';
import {LearnerService} from '../learner.service';
import {AuthenticationResponse} from './authentication-response.model';
import {ACCESS_TOKEN} from '../../../shared/constants';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private learnerService: LearnerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessTokenRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ` + localStorage.getItem(ACCESS_TOKEN)
      }
    });

    return next.handle(accessTokenRequest).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401 && this.learnerService.learner$.value != null) {
        return this.handle401Error(accessTokenRequest, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tokenService.refreshToken().pipe(
      switchMap((authenticationResponse: AuthenticationResponse) => {
        return next.handle(JwtInterceptor.addTokenHeader(request, authenticationResponse.accessToken));
      }),
      catchError((err) => {
        this.learnerService.logout();
        return throwError(err);
      })
    );
  }

  private static addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
  }
}
