import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async record(
    action: string,
    options: {
      adminId?: number | null;
      adminEmail?: string | null;
      ipAddress?: string | null;
      details?: string | null;
    } = {},
  ): Promise<AuditLog> {
    const log = this.auditLogRepo.create({
      action,
      adminId: options.adminId ?? null,
      adminEmail: options.adminEmail ?? null,
      ipAddress: options.ipAddress ?? null,
      details: options.details ?? null,
    });
    return this.auditLogRepo.save(log);
  }

  async findAll(limit = 100, page = 1): Promise<{ logs: AuditLog[]; total: number }> {
    const [logs, total] = await this.auditLogRepo.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { logs, total };
  }
}
