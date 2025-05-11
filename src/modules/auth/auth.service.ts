import { HttpException, Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { RedisService } from 'src/services/redis.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { I_Base_Response } from 'src/interfaces/response.interfaces';
import { I_BaseResponseAuth, I_ResponseLogin } from './interfaces/response.interface';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  signToken = (user: I_BaseResponseAuth, secret: string, expiresIn: string): string =>
    this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      {
        secret,
        expiresIn,
      },
    );

  async register(key: string, seconds: number): Promise<Partial<I_Base_Response>> {
    try {
      const user: User | null = await this.userRepository.findByCondition({
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
  ): Promise<I_Base_Response<I_BaseResponseAuth>> {
    try {
      const codeRedis = await this.redisService.get(key);
      if (!codeRedis) throw new HttpException('OTP not found', 404);
      if (codeRedis !== code) throw new HttpException('OTP not found', 404);
      const codeDel = await this.redisService.del(key);
      if (!codeDel) throw new HttpException('OTP not found', 404);

      const hashedPassword = await this.hashPassword(createUserDto.password);
      const userCreate: User = this.userRepository.createOne({
        ...createUserDto,
        password: hashedPassword,
      });

      const user = await this.userRepository.saveOne(userCreate);
      if (!user) throw new HttpException('OTP incorrect!', 401);

      const userWithoutPassword = omit(user, ['password']);

      return {
        statusCode: 200,
        message: 'User created successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async login(
    email: string,
    password: string,
    response: Response,
  ): Promise<I_Base_Response<Partial<I_ResponseLogin>>> {
    try {
      const user: User | null = await this.userRepository.findByCondition({
        where: { email },
      });

      if (!user) throw new HttpException('Login error!', 404);

      const isPasswordValid = await this.comparePassword(password, user.password);
      if (!isPasswordValid) throw new HttpException('Password incorrect!', 404);

      this.createAndSendToken(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        response,
      );

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

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  logout(response: Response): Partial<I_Base_Response> {
    try {
      this.clearToken(response);
      return {
        statusCode: 200,
        message: 'Logout successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async refreshToken(request: Request, response: Response): Promise<Partial<I_Base_Response>> {
    try {
      const refreshToken = request.cookies['refreshToken'] as string;
      if (!refreshToken) throw new HttpException('Token not found', 404);

      const user = this.jwtService.verify<I_BaseResponseAuth>(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN || 'jwt_refresh_token',
      });

      if (!user) throw new HttpException('Token invalid', 401);

      const userCheck = await this.userRepository.findOneById({ id: user.id });
      if (!userCheck) {
        this.clearToken(response);
        throw new HttpException('User not found', 404);
      }

      this.clearToken(response);
      this.createAndSendToken(user, response);
      return {
        statusCode: 200,
        message: 'Refresh token successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 401);
    }
  }

  async checkAuth(
    request: Request,
    response: Response,
  ): Promise<I_Base_Response<I_BaseResponseAuth>> {
    try {
      const user = request['user'] as I_BaseResponseAuth;

      const userCheck = await this.userRepository.findOneById({ id: user.id });

      if (!userCheck) throw new HttpException('User not found', 404);

      const userWithoutPassword = omit(userCheck, ['password']);

      return {
        statusCode: 200,
        message: 'Check auth successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      this.clearToken(response);
      throw new HttpException((error as Error).message, 404);
    }
  }

  createAndSendToken(user: I_BaseResponseAuth, response: Response): void {
    const accessToken = this.signToken(
      user,
      process.env.JWT_ACCESS_TOKEN || 'jwt_access_token',
      '1m',
    );
    const refreshToken = this.signToken(
      user,
      process.env.JWT_REFRESH_TOKEN || 'jwt_refresh_token',
      '7d',
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  clearToken(response: Response): void {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
  }
}
