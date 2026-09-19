import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = '';
  isInviteMode = signal(false);
  newPassword = '';
  confirmPassword = '';
  showNew = signal(false);
  showConfirm = signal(false);

  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    const currentUrl = this.router.url;
    this.isInviteMode.set(currentUrl.includes('set-password'));

    if (!this.token) {
      this.errorMessage.set('Invalid or missing security token in URL.');
    }
  }

  onSubmit() {
    if (!this.token) {
      this.errorMessage.set('Security token is missing.');
      return;
    }

    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match. Please re-enter.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const call$ = this.isInviteMode()
      ? this.authService.setPassword(this.token, this.newPassword)
      : this.authService.resetPassword(this.token, this.newPassword);

    call$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ||
            'Failed to configure password. The token may be expired or already used.',
        );
      },
    });
  }
}
