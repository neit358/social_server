import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { I_find } from 'src/interfaces/find.interfaces';
import { I_UpdateUser } from './interfaces/update.interfaces';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  async existsUser(data: I_find): Promise<boolean> {
    return await this.exists(data);
  }

  async findUser(data: I_find): Promise<User | null> {
    return await this.findOne(data);
  }

  async findUsers(): Promise<User[]> {
    return this.find();
  }

  async updateUser(id: string, updateUser: I_UpdateUser): Promise<User | null> {
    await this.update(id, updateUser);
    return this.findOneBy({ id });
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(id);
  }
}
