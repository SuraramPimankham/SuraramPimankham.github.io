import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const body = error.error;
      const message =
        (body && typeof body === 'object' && 'message' in body && body.message) ||
        (typeof body === 'string' && body) ||
        `HTTP ${error.status}`;
      return throwError(() => new Error(String(message)));
    }),
  );
};
