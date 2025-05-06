import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Like } from './entities/like.entity';

@Injectable()
export class LikeRepository {
  constructor(@InjectRepository(Like) private likeRepository: Repository<Like>) {}

  async getLike(postId: string, userId: string): Promise<Like | null> {
    return await this.likeRepository.findOne({ where: { userId, postId } });
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return await this.likeRepository.find({ where: { postId } });
  }

  async deleteLike(userId: string, postId: string): Promise<DeleteResult> {
    return await this.likeRepository.delete({ userId, postId });
  }

  async createLike(userId: string, postId: string): Promise<Like | null> {
    const likeCreate = this.likeRepository.create({ userId, postId });
    return await this.likeRepository.save(likeCreate);
  }
}
