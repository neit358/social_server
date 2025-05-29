import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import BaseAbstractRepository from '../../repositories/base.abstract.repository';
import { RedisService } from '../../services/redis.service';
import { SearchService } from '../../services/elasticsearch.service';

@Injectable()
export class UserRepository extends BaseAbstractRepository<User> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    redisService: RedisService,
    searchService: SearchService<User>,
  ) {
    super(userRepository, redisService, searchService);
  }
}
