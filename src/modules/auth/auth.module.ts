import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/entities/user.entity';
import { RedisService } from 'src/services/redis.service';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, RedisService, UserRepository],
})
export class AuthModule {}
