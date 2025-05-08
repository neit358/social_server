import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyRegisterDto } from './dto';

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
  async login(@Body() { email, password }: LoginDto) {
    return await this.authService.login(email, password);
  }
}
