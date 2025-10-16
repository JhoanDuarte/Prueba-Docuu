
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LoginComponent } from './features/auth/pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES)
  },
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  { path: '**', redirectTo: 'orders' }
];
