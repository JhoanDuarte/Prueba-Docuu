import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  /** Guarda el token JWT en localStorage */
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /** Obtiene el token actual */
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /** Elimina el token del almacenamiento */
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  /** Retorna true si existe un token almacenado */
  has(): boolean {
    return !!this.get();
  }
}
