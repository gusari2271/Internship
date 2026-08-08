import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';
  
  public isLoggedIn = signal<boolean>(this.hasToken());

  login(credentials: { email: string; password: string }): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('admin_token', response.access_token);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('admin_token');
  }
}
