import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user: User | null = await this.authService.register(createUserDto);
    if (!user) throw new HttpException('Create user error!', 404);
    return user;
  }

  @Post('login')
  async login(@Body() { name, password }: { name: string; password: string }): Promise<User> {
    const user: User | null = await this.authService.login(name, password);
    if (!user) throw new HttpException('Login error!', 404);
    return user;
  }
}
