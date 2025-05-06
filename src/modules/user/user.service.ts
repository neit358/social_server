import { Injectable, HttpException, BadRequestException } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UpdatePasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { I_Base_Response } from 'src/types/response.type';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<I_Base_Response<User>> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      };
    } catch {
      throw new BadRequestException('Find user error!');
    }
  }

  async findUsers(): Promise<I_Base_Response<User[]>> {
    try {
      const users = await this.userRepository.findUsers();
      if (!users) throw new HttpException('Users not found', 404);
      return {
        statusCode: 200,
        message: 'Get users successfully',
        data: users,
      };
    } catch {
      throw new BadRequestException('Find users error!');
    }
  }

  async updateUser(
    id: string,
    updateUser: Partial<UpdateUserDto>,
    image?: string,
  ): Promise<I_Base_Response<User>> {
    try {
      const userExists = await this.userRepository.findUserById(id);
      if (!userExists) {
        throw new HttpException('User not found', 404);
      }

      let urlImage: string | null = null;

      if (image) {
        urlImage =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          image;
      }

      const userUpdated = await this.userRepository.updateUser(id, {
        ...updateUser,
        avatar: urlImage || userExists.avatar,
      });

      if (!userUpdated) throw new HttpException('User update error!', 404);
      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: userUpdated,
      };
    } catch {
      throw new BadRequestException('User update error!');
    }
  }

  async updatePasswordCtr(
    id: string,
    data: UpdatePasswordUserDto,
  ): Promise<I_Base_Response<Partial<User>>> {
    try {
      const { oldPassword, newPassword, confirmPassword } = data;
      const user: User | null = await this.userRepository.findUserById(id);
      if (!user) throw new HttpException('User not found', 404);
      if (user.password !== oldPassword) throw new HttpException('Old password is incorrect', 400);
      if (newPassword !== confirmPassword)
        throw new HttpException('Password and confirm password are not the same', 400);
      if (newPassword === oldPassword)
        throw new HttpException('New password is the same as old password', 400);
      const userUpdated = await this.userRepository.updateUser(id, {
        password: newPassword,
      });

      const userWithoutPassword = omit(userUpdated, ['password']);
      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: userWithoutPassword,
      };
    } catch {
      throw new BadRequestException('User update error!');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findUserById(id);
      if (!user) throw new HttpException('User not found', 404);
      await this.userRepository.deleteUser(id);
    } catch {
      throw new BadRequestException('Delete user error!');
    }
  }
}

// cache user
