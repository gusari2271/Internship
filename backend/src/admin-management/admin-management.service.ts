import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { RefreshToken } from '../auth/refresh-token.entity';
import { MailService } from '../mail/mail.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { InviteAdminDto } from './admin-management.dto';
import * as crypto from 'crypto';

@Injectable()
export class AdminManagementService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly mailService: MailService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async list() {
    const users = await this.userRepository.find({
      order: { role: 'DESC', createdAt: 'DESC' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async invite(dto: InviteAdminDto, currentUser: any, ipAddress?: string) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('An account with this email address already exists');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    const user = this.userRepository.create({
      email: dto.email.toLowerCase().trim(),
      name: dto.name?.trim() || null,
      role: dto.role,
      isActive: true,
      mustChangePassword: true,
      invitationTokenHash: tokenHash,
      invitationExpiresAt: expiresAt,
    });

    const saved = await this.userRepository.save(user);

    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const inviteLink = `${frontendBaseUrl}/admin/set-password?token=${rawToken}`;

    await this.mailService.sendAdminInvitation(saved.email, inviteLink, saved.role);

    await this.auditLogService.record('ADMIN_INVITED', {
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      ipAddress,
      details: JSON.stringify({
        invitedEmail: saved.email,
        role: saved.role,
        invitedId: saved.id,
      }),
    });

    return {
      message: `Invitation successfully dispatched to ${saved.email}`,
      admin: {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
        isActive: saved.isActive,
      },
    };
  }

  async deactivate(targetId: number, currentUser: any, ipAddress?: string) {
    if (currentUser.id === targetId) {
      throw new BadRequestException('Superadmin cannot deactivate their own account');
    }

    const target = await this.userRepository.findOne({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException('Target admin not found');
    }

    if (target.role === 'superadmin') {
      const activeSuperadmins = await this.userRepository.count({
        where: { role: 'superadmin', isActive: true },
      });
      if (activeSuperadmins <= 1) {
        throw new BadRequestException('Cannot deactivate the last active superadmin');
      }
    }

    target.isActive = false;
    await this.userRepository.save(target);

    // Invalidate all active refresh tokens for deactivated user
    await this.refreshTokenRepository.update(
      { userId: targetId },
      { revokedAt: new Date() },
    );

    await this.auditLogService.record('ADMIN_DEACTIVATED', {
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      ipAddress,
      details: JSON.stringify({ deactivatedEmail: target.email, deactivatedId: target.id }),
    });

    return { message: `Administrator ${target.email} has been deactivated` };
  }

  async reactivate(targetId: number, currentUser: any, ipAddress?: string) {
    const target = await this.userRepository.findOne({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException('Target admin not found');
    }

    target.isActive = true;
    await this.userRepository.save(target);

    await this.auditLogService.record('ADMIN_REACTIVATED', {
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      ipAddress,
      details: JSON.stringify({ reactivatedEmail: target.email, reactivatedId: target.id }),
    });

    return { message: `Administrator ${target.email} has been reactivated` };
  }

  async delete(targetId: number, currentUser: any, ipAddress?: string) {
    if (currentUser.id === targetId) {
      throw new BadRequestException('Superadmin cannot delete their own account');
    }

    const target = await this.userRepository.findOne({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException('Target admin not found');
    }

    if (target.role === 'superadmin') {
      const totalSuperadmins = await this.userRepository.count({
        where: { role: 'superadmin' },
      });
      if (totalSuperadmins <= 1) {
        throw new BadRequestException('Cannot delete the last remaining superadmin');
      }
    }

    // Invalidate refresh tokens
    await this.refreshTokenRepository.delete({ userId: targetId });
    await this.userRepository.delete(targetId);

    await this.auditLogService.record('ADMIN_DELETED', {
      adminId: currentUser.id,
      adminEmail: currentUser.email,
      ipAddress,
      details: JSON.stringify({ deletedEmail: target.email, deletedId: targetId }),
    });

    return { message: `Administrator ${target.email} permanently removed` };
  }
}
