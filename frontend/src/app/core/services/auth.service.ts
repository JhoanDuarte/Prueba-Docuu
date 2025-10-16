import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments';
import { TokenService } from './token.service';
import { Observable, map, tap } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: number;
      name: string;
      email: string;
      role: 'viewer' | 'operator' | 'admin';
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base = `${environment.apiBase}/api/auth`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  /** Autentica al usuario y guarda el token */
  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credentials).pipe(
      tap((resp) => this.tokenService.set(resp.data.access_token)),
      map(() => void 0)
    );
  }

  /** Obtiene información del usuario autenticado */
  me(): Observable<any> {
    return this.http.get<{ data: any }>(`${this.base}/me`);
  }

  /** Refresca el token */
  refresh(): Observable<void> {
    return this.http.post<LoginResponse>(`${this.base}/refresh`, {}).pipe(
      tap((resp) => this.tokenService.set(resp.data.access_token)),
      map(() => void 0)
    );
  }

  /** Cierra sesión */
  logout(): Observable<void> {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      tap(() => this.tokenService.clear()),
      map(() => void 0)
    );
  }

  /** Verifica si hay sesión activa */
  isLogged(): boolean {
    return this.tokenService.has();
  }
}
