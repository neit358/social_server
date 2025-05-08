import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as otpGenerator from 'otp-generator';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { RedisService } from 'src/services/redis.service';
import { omit } from 'lodash';
import { I_Base_Response } from 'src/types/response.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async register(key: string, seconds: number): Promise<Partial<I_Base_Response>> {
    try {
      const user: User | null = await this.userRepository.findOne({
        where: { email: key },
      });
      if (user) throw new HttpException('User already exists', 400);
      const code = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      await this.redisService.set(key, code, seconds);

      return {
        statusCode: 200,
        message: 'Send otp successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async verify(
    key: string,
    code: string,
    createUserDto: CreateUserDto,
  ): Promise<I_Base_Response<User>> {
    try {
      const codeRedis = await this.redisService.get(key);
      if (!codeRedis) throw new HttpException('OTP not found', 404);
      if (codeRedis !== code) throw new HttpException('OTP not found', 404);
      const codeDel = await this.redisService.del(key);
      if (!codeDel) throw new HttpException('OTP not found', 404);
      const userCreate: User = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(userCreate);
      if (!user) throw new HttpException('OTP incorrect!', 401);
      return {
        statusCode: 200,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async login(email: string, passwordLogin: string): Promise<I_Base_Response<Partial<User>>> {
    try {
      const user: User | null = await this.userRepository.findOne({
        where: { email, password: passwordLogin },
      });
      if (!user) throw new HttpException('Login error!', 404);
      const userWithoutPassword = omit(user, ['password']);
      return {
        statusCode: 200,
        message: 'Login successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }
}
