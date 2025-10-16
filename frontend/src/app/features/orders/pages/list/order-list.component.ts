import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, TrackByFunction, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersService, Order, OrderStatus } from '../../../../core/services/orders.service';
import { SessionService } from '../../../../core/services/session.service';

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
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly session = inject(SessionService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly page$ = new BehaviorSubject<number>(1);
  private readonly reload$ = new Subject<void>();

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

  loading = false;
  error = '';

  private readonly data$ = combineLatest([
    this.page$,
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ),
    this.reload$.pipe(startWith(void 0))
  ]).pipe(
    tap(() => {
      this.loading = true;
      this.error = '';
      this.cdr.markForCheck();
    }),
    switchMap(([page, filters]) => {
      const { search, status, delivery_date } = filters;
      const statusFilter: OrderStatus | undefined = status ? (status as OrderStatus) : undefined;
      return this.ordersService
        .list({
          page,
          per_page: 10,
          search: search ?? undefined,
          status: statusFilter,
          delivery_date: delivery_date ?? undefined
        })
        .pipe(
          catchError(() => {
            this.error = 'No se pudo cargar la lista. Reintenta mas tarde.';
            this.cdr.markForCheck();
            return of({ data: [], meta: { current_page: page, per_page: 10, total: 0, last_page: 1 } });
          })
        );
    }),
    tap(() => {
      this.loading = false;
      this.cdr.markForCheck();
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly orders$ = this.data$.pipe(map((resp) => resp.data));
  readonly meta$ = this.data$.pipe(map((resp) => resp.meta));

  ngOnInit(): void {}

  trackByOrder: TrackByFunction<Order> = (_index, order) => order.id ?? order.client_name;

  canEdit(): boolean {
    return this.session.hasRole(['operator', 'admin']);
  }

  canDelete(): boolean {
    return this.session.hasRole(['operator', 'admin']);
  }

  refresh(): void {
    this.reload$.next();
  }

  changePage(page: number): void {
    this.page$.next(page);
  }

  delete(order: Order): void {
    if (!order.id || !confirm(`Confirmas eliminar la orden de ${order.client_name}?`)) {
      return;
    }

    this.loading = true;
    this.ordersService
      .delete(order.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.reload$.next();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo eliminar la orden. Intenta de nuevo.';
          this.cdr.markForCheck();
        }
      });
  }
}

