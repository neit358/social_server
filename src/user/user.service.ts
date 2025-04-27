import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(userCreate: CreateUserDto): Promise<User> {
    const user: User = this.userRepository.create(userCreate);
    return this.userRepository.save(user);
  }

  async updateUser(id: number, userUpdate: Partial<CreateUserDto>): Promise<User | null> {
    await this.userRepository.update(id, userUpdate);
    return this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
