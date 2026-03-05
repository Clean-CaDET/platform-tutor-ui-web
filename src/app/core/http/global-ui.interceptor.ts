import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { GlobalLoadingService } from './global-loading.service';
import { NotificationService } from '../notification/notification.service';

export const SKIP_GLOBAL_ERROR = new HttpContextToken<boolean>(() => false);
export const SKIP_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

export const globalUiInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(GlobalLoadingService);
  const notify = inject(NotificationService);

  const skipLoading = req.context.get(SKIP_GLOBAL_LOADING);
  if (!skipLoading) loading.increment();

  return next(req).pipe(
    tap({ finalize: () => { if (!skipLoading) loading.decrement(); } }),
    catchError(error => {
      const skipError = req.context.get(SKIP_GLOBAL_ERROR);
      if (!skipError && error.status !== 401) {
        notify.error();
      }
      return throwError(() => error);
    }),
  );
};
