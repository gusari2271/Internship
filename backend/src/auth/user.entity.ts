import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type UserRole = 'superadmin' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password?: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string | null;

  @Column({ type: 'varchar', default: 'admin' })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  mustChangePassword: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordTokenHash?: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetPasswordExpiresAt?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  invitationTokenHash?: string | null;

  @Column({ type: 'datetime', nullable: true })
  invitationExpiresAt?: Date | null;

  @Column({ type: 'varchar', nullable: true })
  otpHash?: string | null;

  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt?: Date | null;

  @Column({ type: 'integer', default: 0 })
  otpAttempts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
