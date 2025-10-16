
import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersService, Order } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orders = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  loading = true;
  error = '';
  order?: Order;

  readonly statusLabels = {
    pending: 'Pendiente',
    in_progress: 'En progreso',
    completed: 'Completada'
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'No se encontro la orden solicitada.';
      this.loading = false;
      return;
    }

    const id = Number(idParam);
    this.orders
      .get(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.order = order;
          this.loading = false;
        },
        error: () => {
          this.error = 'No se pudo cargar la orden.';
          this.loading = false;
        }
      });
  }

  back(): void {
    this.router.navigate(['/orders']);
  }
}
