import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface UserProfile {
  id: number;
  email: string;
  name?: string | null;
  role: 'superadmin' | 'admin';
  mustChangePassword: boolean;
}

export interface LoginStep1Response {
  requiresOtp: boolean;
  mfaToken: string;
  emailMasked: string;
}

export interface VerifyOtpResponse {
  access_token: string;
  user: UserProfile;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  private userSignal = signal<UserProfile | null>(this.getStoredUser());
  private tokenSignal = signal<string | null>(localStorage.getItem('admin_token'));

  public currentUser = this.userSignal.asReadonly();
  public isLoggedIn = computed(() => !!this.tokenSignal() && !!this.userSignal());
  public isSuperAdmin = computed(() => this.userSignal()?.role === 'superadmin');
  public mustChangePassword = computed(() => !!this.userSignal()?.mustChangePassword);

  constructor() {
    // If token exists, verify profile on initialization
    if (this.tokenSignal()) {
      this.fetchMe().subscribe();
    }
  }

  // --- Step 1: Submit email + password -> receive mfaToken ---
  login(credentials: { email: string; password: string }): Observable<LoginStep1Response> {
    return this.http.post<LoginStep1Response>(`${this.apiUrl}/login`, credentials, {
      withCredentials: true,
    });
  }

  // --- Step 2: Submit 6-digit OTP + mfaToken -> receive access_token & user ---
  verifyOtp(mfaToken: string, otp: string): Observable<VerifyOtpResponse> {
    return this.http
      .post<VerifyOtpResponse>(
        `${this.apiUrl}/verify-otp`,
        { mfaToken, otp },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          this.setSession(response.access_token, response.user);
        }),
      );
  }

  // --- Resend OTP ---
  resendOtp(mfaToken: string): Observable<{ message: string; mfaToken?: string; devOtp?: string }> {
    return this.http.post<{ message: string; mfaToken?: string; devOtp?: string }>(
      `${this.apiUrl}/resend-otp`,
      { mfaToken },
      { withCredentials: true },
    );
  }

  // --- Forgot Password ---
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
      { withCredentials: true },
    );
  }

  // --- Reset Password ---
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { token, newPassword },
      { withCredentials: true },
    );
  }

  // --- Set Password for Invited Admin ---
  setPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/set-password`,
      { token, newPassword },
      { withCredentials: true },
    );
  }

  // --- Change Password (Forced first-login or profile update) ---
  changePassword(newPassword: string, currentPassword?: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/change-password`,
        { newPassword, currentPassword },
        { headers: this.getAuthHeaders(), withCredentials: true },
      )
      .pipe(
        tap(() => {
          const user = this.userSignal();
          if (user) {
            const updated = { ...user, mustChangePassword: false };
            this.setUser(updated);
          }
        }),
      );
  }

  // --- Fetch current user info ---
  fetchMe(): Observable<UserProfile | null> {
    if (!this.tokenSignal()) return of(null);

    return this.http
      .get<UserProfile>(`${this.apiUrl}/me`, {
        headers: this.getAuthHeaders(),
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.setUser(user);
        }),
        catchError(() => {
          this.clearSession();
          return of(null);
        }),
      );
  }

  // --- Logout current device ---
  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.clearSession();
        }),
        catchError(() => {
          this.clearSession();
          return of({ message: 'Logged out' });
        }),
      );
  }

  // --- Logout from all devices ---
  logoutAll(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/logout-all`,
        {},
        { headers: this.getAuthHeaders(), withCredentials: true },
      )
      .pipe(
        tap(() => {
          this.clearSession();
        }),
      );
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.tokenSignal();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private setSession(token: string, user: UserProfile): void {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem('admin_user', JSON.stringify(user));
    this.userSignal.set(user);
  }

  private clearSession(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private getStoredUser(): UserProfile | null {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
