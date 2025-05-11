import { Injectable, HttpException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UpdatePasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { omit } from 'lodash';
import { I_Base_Response } from 'src/interfaces/response.interfaces';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<I_Base_Response<User>> {
    try {
      const user = await this.userRepository.findOneById({ id });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async findUsers(): Promise<I_Base_Response<User[]>> {
    try {
      const users = await this.userRepository.findAll({});
      if (!users) throw new HttpException('Users not found', 404);
      return {
        statusCode: 200,
        message: 'Get users successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async updateUser(
    id: string,
    updateUser: UpdateUserDto,
    avatar?: string,
  ): Promise<Partial<I_Base_Response<User>>> {
    try {
      const user = await this.userRepository.findOneById({ id });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      let urlAvatar: string | null = null;

      if (avatar) {
        urlAvatar =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          avatar;
      }

      await this.userRepository.update(id, {
        ...updateUser,
        avatar: urlAvatar || user.avatar,
      });

      return {
        statusCode: 200,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async updatePasswordCtr(
    id: string,
    data: UpdatePasswordUserDto,
  ): Promise<I_Base_Response<Partial<User>>> {
    try {
      const { oldPassword, newPassword, confirmPassword } = data;
      const user: User | null = await this.userRepository.findOneById({ id });
      if (!user) throw new HttpException('User not found', 404);
      if (user.password !== oldPassword) throw new HttpException('Old password is incorrect', 400);
      if (newPassword !== confirmPassword)
        throw new HttpException('Password and confirm password are not the same', 400);
      if (newPassword === oldPassword)
        throw new HttpException('New password is the same as old password', 400);
      await this.userRepository.update(id, {
        password: newPassword,
      });
      const userUpdated: User | null = await this.userRepository.findOneById({ id });
      if (!userUpdated) throw new HttpException('User not found', 404);

      const userWithoutPassword = omit(userUpdated, ['password']);
      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOneById({ id });
      if (!user) throw new HttpException('User not found', 404);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }
}

// cache user
