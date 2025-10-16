import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments';
import { Observable, map, of, tap } from 'rxjs';

export type OrderStatus = 'pending' | 'in_progress' | 'completed';

export interface Order {
  id?: number;
  client_name: string;
  description: string;
  status: OrderStatus;
  delivery_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersQuery {
  page?: number;
  per_page?: number;
  search?: string;
  status?: OrderStatus;
  client_name?: string;
  delivery_date?: string;
  exclude_id?: number;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly base = `${environment.apiBase}/api/orders`;
  private readonly cache = new Map<number, Order>();

  constructor(private readonly http: HttpClient) {}

  /** Lista ordenes aplicando filtros y paginacion */
  list(query: OrdersQuery = {}): Observable<OrdersResponse> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<OrdersResponse>(this.base, { params });
  }

  /** Recupera una orden por id */
  get(id: number): Observable<Order> {
    if (this.cache.has(id)) {
      return of(this.cache.get(id)!);
    }

    return this.http.get<{ data: Order }>(`${this.base}/${id}`).pipe(
      map((resp) => resp.data),
      tap((order) => this.cache.set(order.id!, order))
    );
  }

  /** Crea una orden */
  create(order: Order): Observable<Order> {
    return this.http.post<{ data: Order }>(this.base, order).pipe(
      map((resp) => resp.data),
      tap((created) => this.cache.set(created.id!, created))
    );
  }

  /** Actualiza una orden existente */
  update(id: number, order: Partial<Order>): Observable<Order> {
    return this.http.put<{ data: Order }>(`${this.base}/${id}`, order).pipe(
      map((resp) => resp.data),
      tap((updated) => this.cache.set(updated.id!, updated))
    );
  }

  /** Elimina una orden */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(
      tap(() => this.cache.delete(id))
    );
  }

  /** Verifica si existe una orden con el mismo cliente y fecha */
  checkDuplicate(clientName: string, deliveryDate: string, excludeId?: number): Observable<boolean> {
    const params: OrdersQuery = {
      client_name: clientName,
      delivery_date: deliveryDate,
      per_page: 1
    };
    if (excludeId) {
      params.exclude_id = excludeId;
    }

    return this.list(params).pipe(map((resp) => resp.data.length > 0));
  }
}
