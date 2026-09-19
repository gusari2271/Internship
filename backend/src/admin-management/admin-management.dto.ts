import { IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import type { UserRole } from '../auth/user.entity';

export class InviteAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  name?: string;

  @IsIn(['admin', 'superadmin'])
  @IsNotEmpty()
  role: UserRole;
}
