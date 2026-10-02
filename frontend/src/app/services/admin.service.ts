import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface AdminUser {
  id: number;
  email: string;
  name?: string | null;
  role: 'superadmin' | 'admin';
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: number;
  adminId?: number | null;
  adminEmail?: string | null;
  action: string;
  ipAddress?: string | null;
  details?: string | null;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : '';

  getAdmins(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/admin/list`, {
      headers: this.authService.getAuthHeaders(),
      withCredentials: true,
    });
  }

  inviteAdmin(data: { email: string; name?: string; role: 'admin' | 'superadmin' }): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/invite`, data, {
      headers: this.authService.getAuthHeaders(),
      withCredentials: true,
    });
  }

  deactivateAdmin(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/admin/${id}/deactivate`,
      {},
      { headers: this.authService.getAuthHeaders(), withCredentials: true },
    );
  }

  reactivateAdmin(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/admin/${id}/reactivate`,
      {},
      { headers: this.authService.getAuthHeaders(), withCredentials: true },
    );
  }

  deleteAdmin(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/admin/${id}`, {
      headers: this.authService.getAuthHeaders(),
      withCredentials: true,
    });
  }

  getAuditLogs(limit = 100, page = 1): Observable<{ logs: AuditLogItem[]; total: number }> {
    return this.http.get<{ logs: AuditLogItem[]; total: number }>(
      `${this.baseUrl}/audit-logs?limit=${limit}&page=${page}`,
      { headers: this.authService.getAuthHeaders(), withCredentials: true },
    );
  }
}
