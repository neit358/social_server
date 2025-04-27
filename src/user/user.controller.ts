import { Body, Controller, Delete, Get, HttpException, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUserByIdCtr(@Param() { id }: { id: number }) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Get()
  async finUsersCtr() {
    return await this.userService.findUsers();
  }

  @Patch('update/:id')
  async updateUserCtr(@Param() { id }: { id: number }, @Body() userUpdate: Partial<UpdateUserDto>) {
    const user = await this.userService.updateUser(id, userUpdate);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Delete('delete/:id')
  async deleteUserCtr(@Param() { id }: { id: number }) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return await this.userService.deleteUser(id);
  }
}
