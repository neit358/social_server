import { Injectable } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(@InjectRepository(Like) private likeRepository: Repository<Like>) {}

  async findLike(userId: string, postId: string): Promise<Like | null> {
    return await this.likeRepository.findOne({ where: { userId, postId } });
  }

  async getLikeById(postId: string, userId: string): Promise<Like | null> {
    return await this.likeRepository.findOne({ where: { postId, userId } });
  }

  async getLikesByPostId(postId: string): Promise<Like[]> {
    return await this.likeRepository.find({ where: { postId } });
  }

  async actionLike(userId: string, postId: string): Promise<Like | boolean | null> {
    const liked = await this.findLike(userId, postId);
    if (liked) {
      const response = await this.deleteLike(userId, postId);
      return response;
    }

    const response = await this.createLike(userId, postId);
    return response;
  }

  async deleteLike(userId: string, postId: string): Promise<boolean | null> {
    try {
      await this.likeRepository.delete({ userId, postId });
      return true;
    } catch {
      return null;
    }
  }

  async createLike(userId: string, postId: string): Promise<Like | null> {
    const likeCreate = this.likeRepository.create({ userId, postId });
    return await this.likeRepository.save(likeCreate);
  }
}
