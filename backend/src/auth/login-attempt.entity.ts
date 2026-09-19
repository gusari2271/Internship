import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('login_attempts')
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  ipAddress: string;

  @Column({ type: 'boolean', default: false })
  isSuccessful: boolean;

  @CreateDateColumn()
  attemptedAt: Date;
}
