import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { omit } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUserByIdCtr(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return {
      statusCode: 200,
      message: 'Get user successfully',
      data: user,
    };
  }

  @Get()
  async finUsersCtr() {
    const users = await this.userService.findUsers();
    if (!users) throw new HttpException('Users not found', 404);
    return {
      statusCode: 200,
      message: 'Get users successfully',
      data: users,
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateUserCtr(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUser: Partial<UpdateUserDto>,
  ) {
    const image = file?.path;
    const userExists = await this.userService.findUserById(id);
    if (!userExists) return null;

    let urlImage: string | null = null;

    if (file) {
      urlImage =
        (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    }

    const userUpdated = await this.userService.updateUser(id, {
      ...updateUser,
      avatar: urlImage || userExists.avatar,
    });
    if (!userUpdated) throw new HttpException('User update error!', 404);
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: userUpdated,
    };
  }

  @Delete('delete/:id')
  async deleteUserCtr(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return await this.userService.deleteUser(id);
  }

  @Patch('update-password/:id')
  async updatePasswordCtr(
    @Param('id') id: string,
    @Body() data: { newPassword: string; oldPassword: string; confirmPassword: string },
  ) {
    const { newPassword, oldPassword, confirmPassword } = data;
    const user: User | null = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    if (user.password !== oldPassword) throw new HttpException('Old password is incorrect', 400);
    if (newPassword !== confirmPassword)
      throw new HttpException('Password and confirm password are not the same', 400);
    if (newPassword === oldPassword)
      throw new HttpException('New password is the same as old password', 400);
    const userUpdated = await this.userService.updateUser(id, {
      password: newPassword,
    });

    if (!userUpdated) throw new HttpException('User update error!', 404);
    const userWithoutPassword = omit(userUpdated, ['password']);
    return {
      statusCode: 200,
      message: 'User updated successfully',
      data: userWithoutPassword,
    };
  }
}
