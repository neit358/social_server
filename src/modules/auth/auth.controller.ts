import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register/:key')
  async register(@Param('key') key: string) {
    return await this.authService.register(key);
  }

  @Post('register/verify')
  async verify(
    @Body()
    { email, code, createUserDto }: { email: string; code: string; createUserDto: CreateUserDto },
  ) {
    return await this.authService.verify(email, code, createUserDto);
  }

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    return await this.authService.login(email, password);
  }
}
