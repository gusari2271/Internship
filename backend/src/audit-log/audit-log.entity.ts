import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true })
  adminId?: number | null;

  @Column({ type: 'varchar', nullable: true })
  adminEmail?: string | null;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress?: string | null;

  @Column({ type: 'text', nullable: true })
  details?: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
