import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('register/:key')
  async register(@Param('key') key: string) {
    const response: boolean | null = await this.authService.register(key);
    if (!response) throw new HttpException('User already exists!', 404);
    return {
      statusCode: 200,
      message: 'Send otp successfully',
    };
  }

  @Post('register/verify')
  async verify(
    @Body()
    { email, code, createUserDto }: { email: string; code: string; createUserDto: CreateUserDto },
  ) {
    const user: User | null = await this.authService.verify(email, code, createUserDto);
    if (!user) throw new HttpException('OTP incorrect!', 401);
    return {
      statusCode: 200,
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }) {
    const user: Partial<User> | null = await this.authService.login(email, password);
    if (!user) throw new HttpException('Login error!', 404);
    return {
      statusCode: 200,
      message: 'Login successfully',
      data: user,
    };
  }
}
