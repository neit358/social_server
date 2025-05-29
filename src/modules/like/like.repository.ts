import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';
import BaseAbstractRepository from '../../repositories/base.abstract.repository';
import { RedisService } from '../../services/redis.service';
import { SearchService } from '../../services/elasticsearch.service';

@Injectable()
export class LikeRepository extends BaseAbstractRepository<Like> {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    redisService: RedisService,
    searchService: SearchService<Like>,
  ) {
    super(likeRepository, redisService, searchService);
  }
}
