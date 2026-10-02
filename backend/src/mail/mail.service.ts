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

    if (user && pass && pass !== 'your-google-app-password') {
      const isGmail = (host && host.includes('gmail')) || (user && user.endsWith('@gmail.com'));
      this.transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: 'gmail',
              auth: { user, pass },
            }
          : {
              host: host || 'smtp.gmail.com',
              port,
              secure: port === 465,
              auth: { user, pass },
              tls: { rejectUnauthorized: false },
            },
      );
      this.logger.log(`SMTP transporter successfully configured for account: ${user}`);
    } else {
      this.logger.warn(
        '[SMTP SIMULATION MODE] SMTP_USER or SMTP_PASS not set in backend/.env. Emails will be printed to terminal console only.',
      );
    }
  }

  async sendOtp(to: string, otp: string): Promise<void> {
    const user = process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || (user ? `"GRAHITA Design" <${user}>` : 'no-reply@grahita.id');
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

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({ from, to, subject, html });
        this.logger.log(`[REAL EMAIL SENT] 2FA OTP code successfully sent to ${to} (MessageId: ${info.messageId})`);
      } catch (err: any) {
        this.logger.error(`[EMAIL ERROR] Failed to send OTP email to ${to}: ${err.message}`);
      }
    }

    if (!this.transporter || process.env.NODE_ENV !== 'production') {
      console.log('\n========================================');
      console.log(`[2FA OTP CODE] Verification code for ${to}: [ ${otp} ]`);
      console.log('========================================\n');
    }
  }

  async sendPasswordReset(to: string, resetLink: string): Promise<void> {
    const user = process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || (user ? `"GRAHITA Design" <${user}>` : 'no-reply@grahita.id');
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

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({ from, to, subject, html });
        this.logger.log(`[REAL EMAIL SENT] Password reset link sent to ${to} (MessageId: ${info.messageId})`);
      } catch (err: any) {
        this.logger.error(`[EMAIL ERROR] Failed to send password reset email to ${to}: ${err.message}`);
      }
    }

    if (!this.transporter || process.env.NODE_ENV !== 'production') {
      console.log('\n========================================');
      console.log(`[PASSWORD RESET LINK] Reset URL for ${to}:`);
      console.log(resetLink);
      console.log('========================================\n');
    }
  }

  async sendAdminInvitation(to: string, inviteLink: string, role: string): Promise<void> {
    const user = process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || (user ? `"GRAHITA Design" <${user}>` : 'no-reply@grahita.id');
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

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({ from, to, subject, html });
        this.logger.log(`[REAL EMAIL SENT] Admin invitation sent to ${to} (MessageId: ${info.messageId})`);
      } catch (err: any) {
        this.logger.error(`[EMAIL ERROR] Failed to send invitation email to ${to}: ${err.message}`);
      }
    } else {
      console.log('\n========================================');
      console.log(`[DEV MODE - INVITE LINK] Admin Invitation Link for ${to} (${role}):`);
      console.log(inviteLink);
      console.log('========================================\n');
    }
  }

  async sendContactFormConfirmation(to: string, message: string, name: string): Promise<void> {
    const user = process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || (user ? `"GRAHITA Design" <${user}>` : 'no-reply@grahita.id');
    const subject = 'Thank you for contacting GRAHITA Design';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; letter-spacing: -0.5px; margin-bottom: 8px;">GRAHITA DESIGN</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">We received your message</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #333; font-size: 14px;">Dear ${name},</p>
        <p style="color: #333; font-size: 14px;">Thank you for reaching out to GRAHITA Design. We have received your inquiry and appreciate you considering us for your project.</p>
        <p style="color: #333; font-size: 14px; margin-bottom: 16px;"><strong>Your Message:</strong></p>
        <div style="background: #f7f7f7; padding: 16px; border-radius: 6px; margin-bottom: 24px; white-space: pre-wrap; color: #333;">${message}</div>
        <p style="color: #333; font-size: 14px;">Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">Best regards,<br/>GRAHITA Design Team</p>
      </div>
    `;

    console.log('\n========================================');
    console.log(`[EMAIL DISPATCH] Contact Form Confirmation for ${to}:`);
    console.log('========================================\n');

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({ from, to, subject, html });
        this.logger.log(`[REAL EMAIL SENT] Confirmation sent to ${to} (MessageId: ${info.messageId})`);
      } catch (err: any) {
        this.logger.error(`[EMAIL ERROR] Failed to send contact confirmation to ${to}: ${err.message}`);
      }
    } else {
      this.logger.warn(
        `[REAL EMAIL NOT SENT] Transporter is not configured. Email to ${to} was logged to console only. Set SMTP credentials in backend/.env to send real emails.`,
      );
    }
  }

  async sendContactInquiryNotification(
    senderName: string,
    senderEmail: string,
    message: string,
  ): Promise<void> {
    const to = process.env.CONTACT_INQUIRY_RECEIVER || 'gusari2271@gmail.com';
    const user = process.env.SMTP_USER;
    const from = process.env.SMTP_FROM || (user ? `"GRAHITA Design" <${user}>` : 'no-reply@grahita.id');
    const subject = `[New Project Inquiry] from ${senderName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #111; letter-spacing: -0.5px; margin-bottom: 8px;">GRAHITA DESIGN</h2>
        <p style="color: #666; font-size: 13px; margin-top: 0;">New Contact Inquiry Received</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #333; font-size: 14px;">You have received a new inquiry from the website contact form:</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #777; width: 80px;"><strong>Name:</strong></td>
            <td style="padding: 8px 0; color: #111;">${senderName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; color: #111;"><a href="mailto:${senderEmail}" style="color: #111; font-weight: 600;">${senderEmail}</a></td>
          </tr>
        </table>
        <p style="color: #333; font-size: 14px; margin-bottom: 8px;"><strong>Message:</strong></p>
        <div style="background: #f7f7f7; padding: 16px; border-radius: 6px; margin-bottom: 24px; white-space: pre-wrap; color: #222; font-size: 14px; line-height: 1.6;">${message}</div>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">This inquiry has also been stored in the database.</p>
      </div>
    `;

    console.log('\n========================================');
    console.log(`[EMAIL DISPATCH] Contact Inquiry forwarded to Admin (${to}) from ${senderName} (${senderEmail}):`);
    console.log('========================================\n');

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to,
          replyTo: senderEmail,
          subject,
          html,
        });
        this.logger.log(`[REAL EMAIL SENT] Inquiry notification sent to ${to} (MessageId: ${info.messageId})`);
      } catch (err: any) {
        this.logger.error(`[EMAIL ERROR] Failed to send contact inquiry notification to ${to}: ${err.message}`);
      }
    } else {
      this.logger.warn(
        `[REAL EMAIL NOT SENT] Transporter is not configured. Admin notification to ${to} was logged to console only. Set SMTP credentials in backend/.env to send real emails.`,
      );
    }
  }
}
