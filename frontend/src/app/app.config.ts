// src/app/app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    // 1) Habilita interceptores desde DI
    provideHttpClient(
      withFetch(),              
      withInterceptorsFromDi()   
    ),

    // 2) Registra tu clase como interceptor (multi)
    { provide: HTTP_INTERCEPTORS, useExisting: AuthInterceptor, multi: true },

    provideClientHydration(withEventReplay()),
  ],
};
