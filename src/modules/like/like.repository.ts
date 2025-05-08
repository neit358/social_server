import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Like } from './entities/like.entity';

@Injectable()
export class LikeRepository extends Repository<Like> {
  constructor(@InjectRepository(Like) private likeRepository: Repository<Like>) {
    super(likeRepository.target, likeRepository.manager, likeRepository.queryRunner);
  }

  async getLike(postId: string, userId: string): Promise<Like | null> {
    return await this.findOne({ where: { userId, postId } });
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return await this.find({ where: { postId } });
  }

  async deleteLike(postId: string, userId: string): Promise<DeleteResult> {
    return await this.delete({ userId, postId });
  }

  async createLike(postId: string, userId: string): Promise<Like | null> {
    const likeCreate = this.create({ userId, postId });
    return await this.save(likeCreate);
  }
}
