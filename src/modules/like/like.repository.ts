import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';
import BaseAbstractRepository from 'src/repositories/base.abstract.repository';

@Injectable()
export class LikeRepository extends BaseAbstractRepository<Like> {
  constructor(@InjectRepository(Like) private readonly likeRepository: Repository<Like>) {
    super(likeRepository);
  }
}
