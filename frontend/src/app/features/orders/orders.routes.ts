
import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';
import { OrdersShellComponent } from './pages/shell/orders-shell.component';
import { OrderListComponent } from './pages/list/order-list.component';
import { OrderFormComponent } from './pages/form/order-form.component';
import { OrderDetailComponent } from './pages/detail/order-detail.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrdersShellComponent,
    children: [
      { path: '', component: OrderListComponent },
      { path: 'create', component: OrderFormComponent, canActivate: [roleGuard], data: { roles: ['operator', 'admin'] } },
      { path: ':id', component: OrderDetailComponent },
      { path: ':id/edit', component: OrderFormComponent, canActivate: [roleGuard], data: { roles: ['operator', 'admin'] } }
    ]
  }
];
