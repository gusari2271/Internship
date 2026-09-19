import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Ip,
} from '@nestjs/common';
import { AdminManagementService } from './admin-management.service';
import { InviteAdminDto } from './admin-management.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminManagementController {
  constructor(private readonly adminManagementService: AdminManagementService) {}

  @Get('list')
  async listAdmins() {
    return this.adminManagementService.list();
  }

  @Post('invite')
  async inviteAdmin(
    @Body() dto: InviteAdminDto,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminManagementService.invite(dto, req.user, ip);
  }

  @Patch(':id/deactivate')
  async deactivateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminManagementService.deactivate(id, req.user, ip);
  }

  @Patch(':id/reactivate')
  async reactivateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminManagementService.reactivate(id, req.user, ip);
  }

  @Delete(':id')
  async deleteAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Ip() ip: string,
  ) {
    return this.adminManagementService.delete(id, req.user, ip);
  }
}
