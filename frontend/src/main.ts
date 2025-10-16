// frontend/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';

import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject, provideZoneChangeDetection } from '@angular/core';
import { AuthInterceptor } from './app/core/interceptors/auth-interceptor';


// Adaptador: permite usar la clase AuthInterceptor con withInterceptors
const authInterceptorFn = (req: any, next: any) =>
  inject(AuthInterceptor).intercept(req, next);

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Registramos la clase para que Angular pueda inyectarle TokenService y Router
    AuthInterceptor,
    provideHttpClient(withInterceptors([authInterceptorFn])),
  ],
}).catch(err => console.error(err));
