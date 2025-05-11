import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import BaseAbstractRepository from 'src/repositories/base.abstract.repository';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super(userRepository);
  }
}
