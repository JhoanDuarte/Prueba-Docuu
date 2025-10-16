import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles: string[] = route.data?.['roles'] ?? [];
  if (!roles.length) {
    return true;
  }

  const session = inject(SessionService);
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = session.snapshot;
  if (!user) {
    auth.forceLogout();
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (roles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/orders']);
};
