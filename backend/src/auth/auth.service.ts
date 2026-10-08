import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from './user.entity';
import { LoginAttempt } from './login-attempt.entity';
import { RefreshToken } from './refresh-token.entity';
import { MailService } from '../mail/mail.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LoginAttempt)
    private readonly loginAttemptRepository: Repository<LoginAttempt>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async onModuleInit() {
    // 1. Seed Superadmin Account
    const superadminEmail = (
      process.env.SUPERADMIN_EMAIL || 'superadmin@grahita.id'
    ).toLowerCase();
    const superadminPassword =
      process.env.SUPERADMIN_PASSWORD ||
      crypto.randomBytes(16).toString('hex');

    let superadmin = await this.userRepository.findOne({
      where: [{ email: superadminEmail }, { role: 'superadmin' }],
    });

    if (!superadmin) {
      this.logger.log(`Seeding initial superadmin (${superadminEmail})...`);
      const hashedPassword = await bcrypt.hash(superadminPassword, 10);
      superadmin = this.userRepository.create({
        email: superadminEmail,
        password: hashedPassword,
        name: 'Master Superadmin',
        role: 'superadmin',
        isActive: true,
        mustChangePassword: false,
      });
      await this.userRepository.save(superadmin);
      this.logger.log(
        `Superadmin account initialized: ${superadminEmail}`,
      );
    } else if (process.env.SUPERADMIN_PASSWORD) {
      // Auto-sync email and password from .env if changed
      let needsSave = false;
      if (superadmin.email !== superadminEmail) {
        this.logger.log(`Syncing superadmin email: ${superadmin.email} -> ${superadminEmail}`);
        superadmin.email = superadminEmail;
        needsSave = true;
      }
      const isPasswordMatching =
        superadmin.password &&
        (await bcrypt.compare(superadminPassword, superadmin.password));
      if (!isPasswordMatching) {
        this.logger.log(
          `Syncing superadmin password from .env for ${superadminEmail}...`,
        );
        superadmin.password = await bcrypt.hash(superadminPassword, 10);
        superadmin.mustChangePassword = false;
        needsSave = true;
      }
      if (needsSave) {
        await this.userRepository.save(superadmin);
        // Clear old failed attempts so admin is never locked out after changing credentials
        await this.loginAttemptRepository.delete({ email: superadminEmail });
        this.logger.log(
          `Superadmin credentials successfully synchronized with .env!`,
        );
      }
    }

    // 2. Ensure existing default sub-admin is retained if configured
    const defaultAdminEmail =
      process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    let defaultAdmin = await this.userRepository.findOne({
      where: { email: defaultAdminEmail },
    });
    if (!defaultAdmin) {
      const defaultAdminPassword =
        process.env.DEFAULT_ADMIN_PASSWORD ||
        crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
      defaultAdmin = this.userRepository.create({
        email: defaultAdminEmail,
        password: hashedPassword,
        name: 'Grahita Studio Admin',
        role: 'admin',
        isActive: true,
        mustChangePassword: false,
      });
      await this.userRepository.save(defaultAdmin);
      this.logger.log(`Default sub-admin created: ${defaultAdminEmail}`);
    }
  }

  // Mask email helper for safe client UI display (e.g. j***n@example.com)
  private maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return '****@***.com';
    const [name, domain] = parts;
    if (name.length <= 2) {
      return `${name[0]}*@${domain}`;
    }
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  }

  // --- 1. Step 1: Credentials & Rate Limiting ---
  async loginStep1(loginDto: LoginDto, ipAddress: string) {
    const email = loginDto.email.toLowerCase().trim();

    // Check rate limit: max 5 failed attempts in last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentFailedAttempts = await this.loginAttemptRepository.count({
      where: {
        email,
        isSuccessful: false,
        attemptedAt: MoreThanOrEqual(fifteenMinutesAgo),
      },
    });

    if (recentFailedAttempts >= 5) {
      // Find oldest of the recent 5 attempts to compute wait time
      const oldestAttempt = await this.loginAttemptRepository.findOne({
        where: {
          email,
          isSuccessful: false,
          attemptedAt: MoreThanOrEqual(fifteenMinutesAgo),
        },
        order: { attemptedAt: 'ASC' },
      });

      const elapsedMs = oldestAttempt
        ? Date.now() - oldestAttempt.attemptedAt.getTime()
        : 0;
      const remainingMs = Math.max(15 * 60 * 1000 - elapsedMs, 60 * 1000);
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

      await this.auditLogService.record('RATE_LIMIT_EXCEEDED', {
        adminEmail: email,
        ipAddress,
        details: `Blocked due to ${recentFailedAttempts} failed attempts within 15 minutes. Wait ${remainingMinutes}m.`,
      });

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many failed login attempts. Please wait ${remainingMinutes} minute(s) before trying again.`,
          retryAfterMinutes: remainingMinutes,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Validate credentials
    const user = await this.userRepository.findOne({ where: { email } });
    const isPasswordValid =
      user &&
      user.password &&
      (await bcrypt.compare(loginDto.password, user.password));

    if (!user || !isPasswordValid || !user.isActive) {
      // Record failed attempt
      const attempt = this.loginAttemptRepository.create({
        email,
        ipAddress,
        isSuccessful: false,
      });
      await this.loginAttemptRepository.save(attempt);

      await this.auditLogService.record('LOGIN_FAILED', {
        adminId: user?.id || null,
        adminEmail: email,
        ipAddress,
        details: !user
          ? 'Email not found'
          : !user.isActive
            ? 'Account is deactivated'
            : 'Password mismatch',
      });

      // ALWAYS return generic error message
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otpHash = otpHash;
    user.otpExpiresAt = otpExpiresAt;
    user.otpAttempts = 0;
    await this.userRepository.save(user);

    // Generate short-lived MFA Session Token (5 minutes)
    const mfaToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'mfa_pending' },
      { expiresIn: '5m' },
    );

    // Send OTP via mail service
    await this.mailService.sendOtp(user.email, otp);

    return {
      requiresOtp: true,
      mfaToken,
      emailMasked: this.maskEmail(user.email),
      // Only exposed in non-production environments for automated testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
    };
  }

  // --- 2. Step 2: Verify OTP ---
  async verifyOtp(dto: VerifyOtpDto, ipAddress: string, userAgent?: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.mfaToken);
    } catch {
      throw new UnauthorizedException('MFA verification session expired. Please log in again.');
    }

    if (payload.type !== 'mfa_pending') {
      throw new UnauthorizedException('Invalid token type for OTP verification');
    }

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or inactive');
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      throw new BadRequestException('No pending OTP request found. Please login again.');
    }

    if (new Date() > user.otpExpiresAt) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      user.otpAttempts = 0;
      await this.userRepository.save(user);
      throw new BadRequestException('Verification code has expired. Please log in again.');
    }

    if (user.otpAttempts >= 5) {
      user.otpHash = null;
      user.otpExpiresAt = null;
      user.otpAttempts = 0;
      await this.userRepository.save(user);
      throw new BadRequestException('Maximum OTP attempts exceeded. Please log in from the beginning.');
    }

    // Verify OTP hash
    const inputHash = crypto.createHash('sha256').update(dto.otp.trim()).digest('hex');
    if (inputHash !== user.otpHash) {
      user.otpAttempts += 1;
      await this.userRepository.save(user);

      await this.auditLogService.record('OTP_FAILED', {
        adminId: user.id,
        adminEmail: user.email,
        ipAddress,
        details: `Failed OTP attempt ${user.otpAttempts} of 5`,
      });

      const remainingAttempts = 5 - user.otpAttempts;
      throw new BadRequestException(
        `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // OTP is valid! Clear OTP state
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpAttempts = 0;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Record successful attempt to reset failed attempts
    const successfulAttempt = this.loginAttemptRepository.create({
      email: user.email,
      ipAddress,
      isSuccessful: true,
    });
    await this.loginAttemptRepository.save(successfulAttempt);

    // Record audit log
    await this.auditLogService.record('LOGIN_SUCCESS', {
      adminId: user.id,
      adminEmail: user.email,
      ipAddress,
      details: `Successful 2FA login as ${user.role}`,
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const rawRefreshToken = await this.createRefreshToken(user.id, ipAddress, userAgent);

    return {
      access_token: accessToken,
      refreshToken: rawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  // --- 3. Resend OTP ---
  async resendOtp(mfaToken: string) {
    let payload: any;
    try {
      // Use ignoreExpiration so users can resend even if the 5-min MFA window just expired
      payload = this.jwtService.verify(mfaToken, { ignoreExpiration: true });
    } catch {
      throw new UnauthorizedException('Verification session is invalid. Please log in again.');
    }

    if (payload.type !== 'mfa_pending') {
      throw new UnauthorizedException('Invalid token type for OTP resend.');
    }

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Account not found or inactive');
    }

    // Cooldown check (60 seconds): block if OTP was issued less than 60 seconds ago
    if (user.otpExpiresAt) {
      const msUntilExpiry = user.otpExpiresAt.getTime() - Date.now();
      // OTP lifetime is 5 min (300s). If remaining > 240s, it was created < 60s ago
      if (msUntilExpiry > 4 * 60 * 1000) {
        const cooldownRemainingSec = Math.ceil((msUntilExpiry - 4 * 60 * 1000) / 1000);
        throw new BadRequestException(
          `Please wait ${cooldownRemainingSec} seconds before requesting another code.`,
        );
      }
    }

    // Generate brand-new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpHash = crypto.createHash('sha256').update(newOtp).digest('hex');
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // fresh 5 min expiry
    user.otpAttempts = 0;
    await this.userRepository.save(user);

    // Issue a fresh mfaToken (5 min) so the OTP step can continue
    const newMfaToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'mfa_pending' },
      { expiresIn: '5m' },
    );

    await this.mailService.sendOtp(user.email, newOtp);

    return {
      message: 'A new verification code has been dispatched.',
      mfaToken: newMfaToken,
      // Only exposed in non-production environments for automated testing
      ...(process.env.NODE_ENV !== 'production' && { devOtp: newOtp }),
    };
  }


  // --- 4. Forgot Password Flow (User Enumeration Safe) ---
  async forgotPassword(dto: ForgotPasswordDto, ipAddress: string) {
    const email = dto.email.toLowerCase().trim();
    const genericResponse = {
      message: 'If this email is registered, a password reset link has been sent to your inbox.',
    };

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.isActive) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await this.userRepository.save(user);

    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const resetLink = `${frontendBaseUrl}/admin/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordReset(user.email, resetLink);

    await this.auditLogService.record('PASSWORD_RESET_REQUESTED', {
      adminId: user.id,
      adminEmail: user.email,
      ipAddress,
    });

    return genericResponse;
  }

  // --- 5. Reset Password Flow ---
  async resetPassword(dto: ResetPasswordDto, ipAddress: string) {
    const tokenHash = crypto.createHash('sha256').update(dto.token.trim()).digest('hex');
    const user = await this.userRepository.findOne({
      where: { resetPasswordTokenHash: tokenHash },
    });

    const expiresAt = user?.resetPasswordExpiresAt
      ? new Date(user.resetPasswordExpiresAt)
      : null;

    if (!user || !expiresAt || isNaN(expiresAt.getTime()) || new Date() > expiresAt) {
      throw new BadRequestException('Password reset token is invalid or has expired.');
    }

    // Hash new password
    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpiresAt = null;
    user.mustChangePassword = false;
    await this.userRepository.save(user);

    // Invalidate all active sessions & clear rate limit failed attempts
    await this.revokeAllUserTokens(user.id);
    await this.loginAttemptRepository.delete({ email: user.email });

    await this.auditLogService.record('PASSWORD_RESET_COMPLETED', {
      adminId: user.id,
      adminEmail: user.email,
      ipAddress,
      details: 'Password was successfully reset and all sessions terminated',
    });

    return { message: 'Password has been successfully updated. You may now log in.' };
  }

  // --- 6. Set Password for Invited Admin ---
  async setPassword(dto: ResetPasswordDto, ipAddress: string) {
    const tokenHash = crypto.createHash('sha256').update(dto.token.trim()).digest('hex');
    const user = await this.userRepository.findOne({
      where: { invitationTokenHash: tokenHash },
    });

    if (!user || !user.invitationExpiresAt || new Date() > user.invitationExpiresAt) {
      throw new BadRequestException('Invitation token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.invitationTokenHash = null;
    user.invitationExpiresAt = null;
    user.mustChangePassword = false;
    user.isActive = true;
    await this.userRepository.save(user);

    await this.auditLogService.record('ADMIN_ACTIVATED', {
      adminId: user.id,
      adminEmail: user.email,
      ipAddress,
      details: 'Admin configured initial password from invitation',
    });

    return { message: 'Account activated and password configured successfully. You may now log in.' };
  }

  // --- 7. Change Password (Logged In / Forced Initial Reset) ---
  async changePassword(userId: number, dto: ChangePasswordDto, ipAddress: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.mustChangePassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Current password is required');
      }
      const isMatch = user.password && (await bcrypt.compare(dto.currentPassword, user.password));
      if (!isMatch) {
        throw new BadRequestException('Current password is incorrect');
      }
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.mustChangePassword = false;
    await this.userRepository.save(user);

    await this.auditLogService.record('PASSWORD_CHANGED', {
      adminId: user.id,
      adminEmail: user.email,
      ipAddress,
      details: 'Password changed successfully',
    });

    return { message: 'Password has been successfully updated' };
  }

  // --- 8. Token Refresh ---
  async refreshToken(rawToken: string, ipAddress: string, userAgent?: string) {
    if (!rawToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const record = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });

    if (!record || record.revokedAt || new Date() > record.expiresAt) {
      throw new UnauthorizedException('Session expired or invalidated. Please log in again.');
    }

    const user = await this.userRepository.findOne({ where: { id: record.userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account no longer active');
    }

    // Revoke old refresh token (rotate)
    record.revokedAt = new Date();
    await this.refreshTokenRepository.save(record);

    // Issue new refresh token & access token
    const newRawRefreshToken = await this.createRefreshToken(user.id, ipAddress, userAgent);
    const newAccessToken = this.generateAccessToken(user);

    return {
      access_token: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  // --- 9. Logout Single Session ---
  async logout(rawToken: string, ipAddress?: string) {
    if (rawToken) {
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const record = await this.refreshTokenRepository.findOne({
        where: { tokenHash },
      });
      if (record) {
        record.revokedAt = new Date();
        await this.refreshTokenRepository.save(record);
        await this.auditLogService.record('LOGOUT', {
          adminId: record.userId,
          ipAddress,
        });
      }
    }
    return { message: 'Signed out successfully' };
  }

  // --- 10. Logout All Devices ---
  async logoutAll(userId: number, ipAddress?: string) {
    await this.revokeAllUserTokens(userId);
    await this.auditLogService.record('LOGOUT_ALL_DEVICES', {
      adminId: userId,
      ipAddress,
      details: 'All active sessions invalidated',
    });
    return { message: 'All active sessions have been terminated' };
  }

  // Helpers
  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mustChangePassword: user.mustChangePassword,
    };
    return this.jwtService.sign(payload, { expiresIn: '2h' });
  }

  private async createRefreshToken(
    userId: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<string> {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const token = this.refreshTokenRepository.create({
      tokenHash,
      userId,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
    });
    await this.refreshTokenRepository.save(token);

    return rawToken;
  }

  private async revokeAllUserTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId },
      { revokedAt: new Date() },
    );
  }
}
