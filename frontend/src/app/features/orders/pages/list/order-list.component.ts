import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { OrdersService, Order, OrderStatus } from '../../../../core/services/orders.service';
import { SessionService } from '../../../../core/services/session.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly session = inject(SessionService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  loading = false;
  error = '';
  orders: Order[] = [];
  meta: PaginationMeta = { current_page: 1, per_page: 10, total: 0, last_page: 1 };

  readonly filterForm = this.fb.group({
    search: [''],
    status: ['' as '' | OrderStatus],
    delivery_date: ['']
  });

  readonly statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada'
  };

  ngOnInit(): void {
    this.observeFilters();
    this.load();
  }

  canEdit(): boolean {
    return this.session.hasRole(['operator', 'admin']);
  }

  canDelete(): boolean {
    return this.session.hasRole(['operator', 'admin']);
  }

  refresh(): void {
    this.load(this.meta.current_page);
  }

  changePage(page: number): void {
    if (page === this.meta.current_page || page < 1 || page > this.meta.last_page) {
      return;
    }
    this.load(page);
  }

  delete(order: Order): void {
    if (!order.id || !confirm(`Confirmas eliminar la orden de ${order.client_name}?`)) {
      return;
    }

    this.loading = true;
    this.ordersService.delete(order.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading = false;
        this.load(this.meta.current_page);
      },
      error: () => {
        this.loading = false;
        this.error = 'No se pudo eliminar la orden. Intenta de nuevo.';
      }
    });
  }

  private load(page = 1): void {
    const { search, status, delivery_date } = this.filterForm.value;
    const statusFilter: OrderStatus | undefined = status ? (status as OrderStatus) : undefined;
    this.loading = true;
    this.error = '';

    this.ordersService
      .list({
        page,
        per_page: this.meta.per_page,
        search: search ?? undefined,
        status: statusFilter,
        delivery_date: delivery_date ?? undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (resp) => {
          this.loading = false;
          this.orders = resp.data;
          this.meta = resp.meta;
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo cargar la lista. Reintenta mas tarde.';
        }
      });
  }

  private observeFilters(): void {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        tap(() => (this.meta.current_page = 1)),
        switchMap(() => {
          this.loading = true;
          this.error = '';
          const { search, status, delivery_date } = this.filterForm.value;
          const statusFilter: OrderStatus | undefined = status ? (status as OrderStatus) : undefined;
          return this.ordersService.list({
            page: 1,
            per_page: this.meta.per_page,
            search: search ?? undefined,
            status: statusFilter,
            delivery_date: delivery_date ?? undefined
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (resp) => {
          this.loading = false;
          this.orders = resp.data;
          this.meta = resp.meta;
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo cargar la lista. Reintenta mas tarde.';
        }
      });
  }
}
