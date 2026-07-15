import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly _user = signal<User | null>(null);
  private readonly _loading = signal(true);
  private readonly initPromise: Promise<void>;

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor() {
    this.initPromise = this.init();
  }

  ensureInitialized(): Promise<void> {
    return this.initPromise;
  }

  private async init(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      this._loading.set(false);
      return;
    }
    try {
      const user = await firstValueFrom(this.api.me());
      this._user.set(user);
    } catch {
      localStorage.removeItem('token');
      this._user.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  async login(username: string, password: string): Promise<User> {
    const res = await firstValueFrom(this.api.login(username, password));
    localStorage.setItem('token', res.token);
    this._user.set(res.user);
    return res.user;
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
  }
}
