import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adjuntar Authorization si hay token
    const t = this.token.get();
    const request = t
      ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } })
      : req;

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // 401: sesión inválida/expirada → limpiar y enviar a /login
        if (err.status === 401) {
          this.token.clear();
          // Evitar bucle si ya estás en /login
          if (location.pathname !== '/login') this.router.navigate(['/login']);
        }
        // 403: prohibido → puedes redirigir o mostrar aviso
        if (err.status === 403) {
          console.warn('Acceso prohibido (403)');
          // Ejemplo: this.router.navigate(['/']); // o mostrar toast
        }
        return throwError(() => err);
      })
    );
  }
}
