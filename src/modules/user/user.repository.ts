import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async updateUser(id: string, updateUser: Partial<UpdateUserDto>): Promise<User | null> {
    await this.userRepository.update(id, updateUser);
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
