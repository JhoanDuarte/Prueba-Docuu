import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import { SessionService, AuthUser } from './session.service';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: AuthUser;
  };
}

interface MeResponse {
  data: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiBase}/api/auth`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokens: TokenService,
    private readonly session: SessionService
  ) {}

  /** Autentica al usuario y guarda token + datos de sesion */
  login(credentials: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.base}/login`, credentials).pipe(
      tap((resp) => {
        this.tokens.set(resp.data.access_token);
        this.session.setUser(resp.data.user);
      }),
      map(() => void 0)
    );
  }

  /** Obtiene el perfil autenticado y sincroniza la sesion */
  me(): Observable<AuthUser> {
    return this.http.get<MeResponse>(`${this.base}/me`).pipe(
      tap((resp) => this.session.setUser(resp.data)),
      map((resp) => resp.data)
    );
  }

  /** Refresca el token (mantiene el usuario actual) */
  refresh(): Observable<void> {
    return this.http.post<LoginResponse>(`${this.base}/refresh`, {}).pipe(
      tap((resp) => this.tokens.set(resp.data.access_token)),
      map(() => void 0)
    );
  }

  /** Cierra sesion en backend y limpia el estado local */
  logout(): Observable<void> {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      catchError(() => of(null)),
      tap(() => this.forceLogout()),
      map(() => void 0)
    );
  }

  /** Permite reutilizar la limpieza de sesion sin llamar al API */
  forceLogout(): void {
    this.tokens.clear();
    this.session.clear();
  }

  /** Indica si existe un token almacenado */
  isLogged(): boolean {
    return this.tokens.has();
  }
}
