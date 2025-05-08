import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.findOneBy({ id });
  }

  async findUsers(): Promise<User[]> {
    return this.find();
  }

  async updateUser(
    id: string,
    updateUser: Partial<UpdateUserDto | CreateUserDto>,
  ): Promise<User | null> {
    await this.update(id, updateUser);
    return this.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  }
}
