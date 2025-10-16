import { Routes } from '@angular/router';
import { authGuard } from '../../../core/guards/auth-guard';

export const ORDERS_ROUTES: Routes = [
  { path: '', canActivate: [authGuard], component: OrdersListComponent },
  { path: 'new', canActivate: [authGuard], component: OrdersFormComponent },
  { path: ':id/edit', canActivate: [authGuard], component: OrdersFormComponent },
];
