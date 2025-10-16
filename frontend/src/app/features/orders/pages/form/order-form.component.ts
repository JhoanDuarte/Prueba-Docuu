import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdersService, Order, OrderStatus } from '../../../../core/services/orders.service';

type Mode = 'create' | 'edit';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  mode: Mode = 'create';
  loading = false;
  saving = false;
  error = '';
  orderId?: number;
  duplicateDetected = false;

  readonly statuses: { value: OrderStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' }
  ];

  readonly form = this.fb.group({
    client_name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    status: ['pending' as OrderStatus, [Validators.required]],
    delivery_date: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.detectMode();
    this.observeDuplicates();
  }

  submit(): void {
    if (this.form.invalid || this.saving || this.duplicateDetected) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.form.value as Order;

    const request$ =
      this.mode === 'create'
        ? this.orders.create(payload)
        : this.orders.update(this.orderId!, payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.errors
          ? 'Revisa los datos ingresados.'
          : 'Ocurrio un error al guardar la orden.';
      }
    });
  }

  title(): string {
    return this.mode === 'create' ? 'Crear orden' : 'Editar orden';
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }

  private detectMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.mode = 'edit';
      this.orderId = Number(idParam);
      this.loadOrder(this.orderId);
    }
  }

  private loadOrder(id: number): void {
    this.loading = true;
    this.orders
      .get(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order) => {
          this.loading = false;
          this.form.patchValue({
            client_name: order.client_name,
            description: order.description,
            status: order.status,
            delivery_date: order.delivery_date
          });
        },
        error: () => {
          this.loading = false;
          this.error = 'No se pudo cargar la orden solicitada.';
        }
      });
  }

  private observeDuplicates(): void {
    const clientControl = this.form.controls.client_name;
    const dateControl = this.form.controls.delivery_date;

    clientControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) {
          this.duplicateDetected = false;
          this.removeDuplicateError(dateControl);
        }
      });

    dateControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) {
          this.duplicateDetected = false;
          this.removeDuplicateError(dateControl);
        }
      });

    combineLatest([
      clientControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ),
      dateControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
    ])
      .pipe(
        filter(([client, delivery]) => !!client && !!delivery),
        switchMap(([client, delivery]) =>
          this.orders.checkDuplicate(client!, delivery!, this.mode === 'edit' ? this.orderId : undefined)
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((duplicate) => {
        this.duplicateDetected = duplicate;
        if (duplicate) {
          this.setDuplicateError(dateControl);
        } else {
          this.removeDuplicateError(dateControl);
        }
      });
  }

  private setDuplicateError(control: typeof this.form.controls.delivery_date): void {
    const current = control.errors ?? {};
    control.setErrors({ ...current, duplicate: true });
  }

  private removeDuplicateError(control: typeof this.form.controls.delivery_date): void {
    if (!control.errors) {
      return;
    }
    const { duplicate, ...rest } = control.errors;
    control.setErrors(Object.keys(rest).length ? rest : null);
  }
}
