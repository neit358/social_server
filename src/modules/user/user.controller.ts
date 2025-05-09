import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UpdatePasswordUserDto, UpdateUserDto } from './dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async finUsersCtr() {
    return await this.userService.findUsers();
  }

  @Get(':id')
  async findUserByIdCtr(@Param('id') id: string) {
    return await this.userService.findUserById(id);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dữ liệu cập nhật người dùng',
    type: UpdateUserDto,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserCtr(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUser: UpdateUserDto,
  ) {
    const avatar = file?.path;
    return await this.userService.updateUser(id, updateUser, avatar);
  }

  @Delete('delete/:id')
  async deleteUserCtr(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @Patch('update-password/:id')
  async updatePasswordCtr(@Param('id') id: string, @Body() data: UpdatePasswordUserDto) {
    return await this.userService.updatePasswordCtr(id, data);
  }
}
