import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Flow State
  step = signal<'credentials' | 'otp'>('credentials');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Step 1: Credentials
  email = '';
  password = '';
  showPassword = signal(false);
  emailTouched = signal(false);
  passwordTouched = signal(false);

  // Step 2: 2FA OTP
  mfaToken = signal<string | null>(null);
  emailMasked = signal<string>('');
  otp = '';
  resendCooldown = signal(0);
  resendSuccess = signal<string | null>(null);
  private cooldownTimer: any = null;

  // Validation
  emailError = computed(() => {
    if (!this.emailTouched()) return null;
    const trimmed = this.email.trim();
    if (!trimmed) return 'Email address is required.';
    // Simple check: must contain @ with something on both sides and a dot after @
    if (!trimmed.includes('@') || trimmed.indexOf('@') === 0 || !trimmed.slice(trimmed.indexOf('@')).includes('.')) {
      return 'Please enter a valid email address.';
    }
    return null;
  });

  // Auto-trim email to prevent copy-paste/autocomplete artifacts
  onEmailInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.email = val.trim();
  }

  passwordError = computed(() => {
    if (!this.passwordTouched()) return null;
    if (!this.password) return 'Password is required.';
    return null;
  });

  toggleShowPassword() {
    this.showPassword.update((val) => !val);
  }

  onCredentialsSubmit() {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);

    if (this.emailError() || this.passwordError() || !this.email || !this.password) {
      this.errorMessage.set('Please fill out all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login({ email: this.email.trim(), password: this.password })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.mfaToken.set(response.mfaToken);
          this.emailMasked.set(response.emailMasked);
          this.step.set('otp');
          this.errorMessage.set(null);
          this.startCooldown(60);
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 429) {
            this.errorMessage.set(
              err.error?.message ||
                'Too many failed attempts. Please wait 15 minutes before trying again.',
            );
          } else {
            // ALWAYS show generic message on credentials failure
            this.errorMessage.set('Invalid email or password. Please try again.');
          }
        },
      });
  }

  onOtpSubmit() {
    const token = this.mfaToken();
    if (!token) {
      this.step.set('credentials');
      return;
    }

    if (!this.otp || this.otp.trim().length < 6) {
      this.errorMessage.set('Please enter the complete 6-digit verification code.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.verifyOtp(token, this.otp.trim()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Invalid or expired verification code.',
        );
      },
    });
  }

  onResendOtp() {
    const token = this.mfaToken();
    if (!token || this.resendCooldown() > 0) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.resendSuccess.set(null);

    this.authService.resendOtp(token).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        // Update mfaToken with fresh token returned by backend
        if (res?.mfaToken) {
          this.mfaToken.set(res.mfaToken);
        }
        this.resendSuccess.set('A new verification code has been dispatched to your email.');
        this.startCooldown(60);
        // Clear previous OTP input so user types the new code
        this.otp = '';
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to resend verification code.');
      },
    });
  }

  backToCredentials() {
    this.step.set('credentials');
    this.errorMessage.set(null);
    this.resendSuccess.set(null);
    this.otp = '';
  }

  private startCooldown(seconds: number) {
    this.resendCooldown.set(seconds);
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      const cur = this.resendCooldown();
      if (cur <= 1) {
        clearInterval(this.cooldownTimer);
        this.resendCooldown.set(0);
      } else {
        this.resendCooldown.set(cur - 1);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }
}
