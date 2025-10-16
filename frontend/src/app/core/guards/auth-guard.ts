import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const tokens = inject(TokenService);
  const router = inject(Router);
  const auth = inject(AuthService);
  const session = inject(SessionService);

  if (!tokens.has()) {
    return redirectToLogin(router, state.url);
  }

  if (session.snapshot) {
    return true;
  }

  return auth.me().pipe(
    map(() => true),
    catchError(() => {
      auth.forceLogout();
      return of<UrlTree>(redirectToLogin(router, state.url));
    })
  );
};

const redirectToLogin = (router: Router, returnUrl: string): UrlTree =>
  router.createUrlTree(['/login'], { queryParams: { returnUrl } });
