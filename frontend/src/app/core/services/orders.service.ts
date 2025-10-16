import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments';
import { Observable } from 'rxjs';

export interface Order {
  id?: number;
  client_name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  delivery_date: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = `${environment.apiBase}/api/orders`;

  constructor(private http: HttpClient) {}

  /** Listar con filtros opcionales y paginación */
  list(filters: Partial<Pick<Order, 'client_name' | 'delivery_date'>> = {}): Observable<any> {
    let params = new HttpParams();
    if (filters.client_name) params = params.set('client_name', filters.client_name);
    if (filters.delivery_date) params = params.set('delivery_date', filters.delivery_date);
    return this.http.get<{ data: Order[]; meta: any }>(this.base, { params });
  }

  /** Obtener una orden */
  get(id: number): Observable<{ data: Order }> {
    return this.http.get<{ data: Order }>(`${this.base}/${id}`);
  }

  /** Crear una orden */
  create(order: Order): Observable<{ data: Order }> {
    return this.http.post<{ data: Order }>(this.base, order);
  }

  /** Actualizar una orden */
  update(id: number, order: Partial<Order>): Observable<{ data: Order }> {
    return this.http.put<{ data: Order }>(`${this.base}/${id}`, order);
  }

  /** Eliminar una orden */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
