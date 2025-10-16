import { Injectable, WritableSignal, signal } from '@angular/core';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'viewer' | 'operator' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly userSignal: WritableSignal<AuthUser | null> = signal<AuthUser | null>(null);

  /** Emite el usuario autenticado actual, o null si no hay sesion */
  readonly user = this.userSignal.asReadonly();

  setUser(user: AuthUser): void {
    this.userSignal.set(user);
  }

  clear(): void {
    this.userSignal.set(null);
  }

  get snapshot(): AuthUser | null {
    return this.userSignal();
  }

  hasRole(roles: string[]): boolean {
    const current = this.userSignal();
    return current ? roles.includes(current.role) : false;
  }
}

