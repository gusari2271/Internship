import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  Ip,
  UseGuards,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const COOKIE_NAME = 'refresh_token';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    return this.authService.loginStep1(loginDto, ip || '127.0.0.1');
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.verifyOtp(
      dto,
      ip || '127.0.0.1',
      userAgent,
    );

    // Set refresh token in HttpOnly cookie
    res.cookie(COOKIE_NAME, result.refreshToken, getCookieOptions());

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtp(dto.mfaToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Ip() ip: string) {
    return this.authService.forgotPassword(dto, ip || '127.0.0.1');
  }

  @Post('reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return this.authService.resetPassword(dto, ip || '127.0.0.1');
  }

  @Post('set-password')
  async setPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return this.authService.setPassword(dto, ip || '127.0.0.1');
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
    @Ip() ip: string,
  ) {
    return this.authService.changePassword(req.user.id, dto, ip || '127.0.0.1');
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const rawToken = req.cookies?.[COOKIE_NAME];
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.refreshToken(
      rawToken,
      ip || '127.0.0.1',
      userAgent,
    );

    // Set rotated refresh cookie
    res.cookie(COOKIE_NAME, result.refreshToken, getCookieOptions());

    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const rawToken = req.cookies?.[COOKIE_NAME];
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return this.authService.logout(rawToken, ip || '127.0.0.1');
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return this.authService.logoutAll(req.user.id, ip || '127.0.0.1');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    return req.user;
  }
}
