import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Configured SMTP transporter with host: ${host}`);
    } else {
      this.logger.warn(
        'SMTP credentials not fully set. Emails will be logged to console in development mode.',
      );
    }
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    const from = process.env.SMTP_FROM || 'no-reply@grahita.id';
    const subject = 'Your Grahita Design 2FA Security Code';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; letter-spacing: -0.5px; margin-bottom: 8px;">GRAHITA DESIGN</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Two-Factor Authentication Security Gateway</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #333; font-size: 14px;">Use the following 6-digit verification code to complete your login:</p>
        <div style="background: #f7f7f7; padding: 18px; border-radius: 6px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 12px;">This code will expire in 5 minutes. If you did not request this code, please secure your account immediately.</p>
      </div>
    `;

    console.log('\n========================================');
    console.log(`[EMAIL DISPATCH] 2FA OTP for ${to}: [ ${otp} ]`);
    console.log('========================================\n');

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to, subject, html });
      } catch (err) {
        this.logger.error(`Failed to send OTP email to ${to}:`, err);
      }
    }
  }

  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    const from = process.env.SMTP_FROM || 'no-reply@grahita.id';
    const subject = 'Reset Your Grahita Design Admin Password';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; letter-spacing: -0.5px; margin-bottom: 8px;">GRAHITA DESIGN</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Password Reset Request</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #333; font-size: 14px;">We received a request to reset your admin password. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetLink}" style="background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Reset Password</a>
        </div>
        <p style="color: #888; font-size: 12px; word-break: break-all;">Or copy and paste this URL into your browser:<br/>${resetLink}</p>
        <p style="color: #888; font-size: 12px;">This link will expire in 30 minutes. If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `;

    console.log('\n========================================');
    console.log(`[EMAIL DISPATCH] Password Reset Link for ${to}:`);
    console.log(resetLink);
    console.log('========================================\n');

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to, subject, html });
      } catch (err) {
        this.logger.error(`Failed to send password reset email to ${to}:`, err);
      }
    }
  }

  async sendAdminInvitation(to: string, inviteLink: string, role: string): Promise<void> {
    const from = process.env.SMTP_FROM || 'no-reply@grahita.id';
    const subject = 'Invitation to Join Grahita Design Administration';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; letter-spacing: -0.5px; margin-bottom: 8px;">GRAHITA DESIGN</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Administrator Invitation (${role.toUpperCase()})</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #333; font-size: 14px;">You have been invited to join the Grahita Design studio management console as an <strong>${role}</strong>.</p>
        <p style="color: #333; font-size: 14px;">Please activate your account and configure your secure password by clicking below:</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${inviteLink}" style="background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">Set Password & Activate</a>
        </div>
        <p style="color: #888; font-size: 12px; word-break: break-all;">Or copy and paste this URL into your browser:<br/>${inviteLink}</p>
        <p style="color: #888; font-size: 12px;">This invitation will expire in 48 hours.</p>
      </div>
    `;

    console.log('\n========================================');
    console.log(`[EMAIL DISPATCH] Admin Invitation Link for ${to} (${role}):`);
    console.log(inviteLink);
    console.log('========================================\n');

    if (this.transporter) {
      try {
        await this.transporter.sendMail({ from, to, subject, html });
      } catch (err) {
        this.logger.error(`Failed to send invitation email to ${to}:`, err);
      }
    }
  }
}
