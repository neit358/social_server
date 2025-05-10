import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyRegisterDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register/:key/:seconds')
  async register(@Param() { key, seconds }: RegisterDto) {
    return await this.authService.register(key, seconds);
  }

  @Post('register/verify')
  async verify(
    @Body()
    { email, code, createUserDto }: VerifyRegisterDto,
  ) {
    return await this.authService.verify(email, code, createUserDto);
  }

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(email, password, response);
  }

  @Get('logout')
  @ApiBasicAuth()
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @Get('refresh')
  refreshToken(
    @Req()
    request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @Get('check')
  checkAuth(
    @Req()
    request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.checkAuth(request, response);
  }
}
