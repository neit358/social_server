import { Body, Controller, Delete, Get, HttpException, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findUserByIdCtr(@Param() { id }: { id: string }) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Get()
  async finUsersCtr() {
    return await this.userService.findUsers();
  }

  @Patch('update/:id')
  async updateUserCtr(@Param() { id }: { id: string }, @Body() updateUser: Partial<UpdateUserDto>) {
    console.log('updateUser', updateUser);

    const userExists = await this.userService.findUserById(id);
    if (!userExists) return null;

    const userUpdated = await this.userService.updateUser(id, updateUser);
    if (!userUpdated) throw new HttpException('User update error!', 404);
    return userUpdated;
  }

  @Delete('delete/:id')
  async deleteUserCtr(@Param() { id }: { id: string }) {
    const user = await this.userService.findUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return await this.userService.deleteUser(id);
  }
}
