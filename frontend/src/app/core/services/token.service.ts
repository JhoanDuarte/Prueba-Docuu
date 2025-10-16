import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly inBrowser = typeof window !== 'undefined' && !!window.localStorage;
  private cachedToken: string | null = this.readFromStorage();

  /** Guarda el token JWT en memoria y, si aplica, en localStorage */
  set(token: string): void {
    this.cachedToken = token;
    if (this.inBrowser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  /** Obtiene el token actual */
  get(): string | null {
    if (!this.cachedToken && this.inBrowser) {
      this.cachedToken = localStorage.getItem(TOKEN_KEY);
    }
    return this.cachedToken;
  }

  /** Elimina el token del almacenamiento */
  clear(): void {
    this.cachedToken = null;
    if (this.inBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  /** Retorna true si existe un token almacenado */
  has(): boolean {
    return !!this.get();
  }

  private readFromStorage(): string | null {
    if (!this.inBrowser) {
      return null;
    }
    return localStorage.getItem(TOKEN_KEY);
  }
}
