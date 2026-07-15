import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateUserRequest,
  DashboardSummary,
  LoginResponse,
  Transaction,
  TransactionFilter,
  UpdateUserRequest,
  User,
} from './models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private authHeaders(json = true): HttpHeaders {
    let headers = new HttpHeaders();
    if (json) {
      headers = headers.set('Content-Type', 'application/json');
    }
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${API}/auth/login`,
      { username, password },
      { headers: this.authHeaders() },
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${API}/auth/me`, { headers: this.authHeaders() });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/users`, { headers: this.authHeaders() });
  }

  createUser(body: CreateUserRequest): Observable<User> {
    return this.http.post<User>(`${API}/users`, body, { headers: this.authHeaders() });
  }

  updateUser(id: number, body: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${API}/users/${id}`, body, { headers: this.authHeaders() });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/users/${id}`, { headers: this.authHeaders(false) });
  }

  getTransactions(params: TransactionFilter = {}): Observable<Transaction[]> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<Transaction[]>(`${API}/transactions`, {
      headers: this.authHeaders(),
      params: httpParams,
    });
  }

  saveTransaction(id: number | null, formData: FormData): Observable<Transaction> {
    const url = id ? `${API}/transactions/${id}` : `${API}/transactions`;
    const method = id ? 'put' : 'post';
    return this.http.request<Transaction>(method, url, {
      headers: this.authHeaders(false),
      body: formData,
    });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/transactions/${id}`, {
      headers: this.authHeaders(false),
    });
  }

  dashboard(userId?: number): Observable<DashboardSummary> {
    const params = userId ? new HttpParams().set('userId', String(userId)) : undefined;
    return this.http.get<DashboardSummary>(`${API}/dashboard`, {
      headers: this.authHeaders(),
      params,
    });
  }
}
