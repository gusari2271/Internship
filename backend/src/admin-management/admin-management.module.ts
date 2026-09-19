import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { RefreshToken } from '../auth/refresh-token.entity';
import { AdminManagementService } from './admin-management.service';
import { AdminManagementController } from './admin-management.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken]), MailModule],
  providers: [AdminManagementService],
  controllers: [AdminManagementController],
  exports: [AdminManagementService],
})
export class AdminManagementModule {}
