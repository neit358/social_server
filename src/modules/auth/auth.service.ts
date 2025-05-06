import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as otpGenerator from 'otp-generator';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { RedisService } from 'src/services/redis.service';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async register(key: string): Promise<boolean | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { name: key },
    });
    if (user) return null;
    const code = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    await this.redisService.set(key, code);
    return true;
  }

  async verify(key: string, code: string, createUserDto: CreateUserDto): Promise<User | null> {
    const codeRedis = await this.redisService.get(key);
    if (!codeRedis) return null;
    if (codeRedis !== code) return null;
    const codeDel = await this.redisService.del(key);
    if (!codeDel) return null;
    const userCreate: User = this.userRepository.create(createUserDto);
    return this.userRepository.save(userCreate);
  }

  async login(email: string, passwordLogin: string): Promise<Partial<User> | null> {
    const user: User | null = await this.userRepository.findOne({
      where: { email, password: passwordLogin },
    });
    if (!user) {
      return null;
    }
    const userWithoutPassword = omit(user, ['password']);
    return userWithoutPassword;
  }
}
