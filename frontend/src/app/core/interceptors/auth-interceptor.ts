import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly tokens: TokenService,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = this.addAuthHeader(req);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.shouldAttemptRefresh(req)) {
          return this.handle401(authReq, next);
        }

        if (error.status === 401 && !req.url.includes('/auth/login')) {
          this.auth.forceLogout();
          this.router.navigate(['/login']);
        }

        if (error.status === 403) {
          console.warn('Acceso denegado por el backend (403).');
        }

        return throwError(() => error);
      })
    );
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokens.get();
    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private shouldAttemptRefresh(request: HttpRequest<unknown>): boolean {
    if (!this.tokens.has()) {
      return false;
    }

    const url = request.url;
    return !url.includes('/auth/login') && !url.includes('/auth/refresh') && !url.includes('/auth/logout');
  }

  private handle401(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshSubject.pipe(
        filter((token): token is string => !!token),
        take(1),
        switchMap(() => next.handle(this.addAuthHeader(request)))
      );
    }

    this.isRefreshing = true;
    this.refreshSubject.next(null);

    return this.auth.refresh().pipe(
      switchMap(() => {
        this.isRefreshing = false;
        const token = this.tokens.get();
        this.refreshSubject.next(token);
        return next.handle(this.addAuthHeader(request));
      }),
      catchError((refreshError) => {
        this.isRefreshing = false;
        this.auth.forceLogout();
        this.router.navigate(['/login']);
        return throwError(() => refreshError);
      })
    );
  }
}
