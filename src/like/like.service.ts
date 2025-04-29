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

  async createLike(userId: string, postId: string): Promise<Like | null> {
    const liked = await this.findLike(userId, postId);
    if (liked) {
      return null;
    }

    const likeCreate = this.likeRepository.create({ userId, postId });

    return await this.likeRepository.save(likeCreate);
  }

  async deleteLIke(userId: string, postId: string): Promise<Like | null> {
    const liked = await this.findLike(userId, postId);
    if (!liked) {
      return null;
    }

    return await this.likeRepository.remove(liked);
  }
}
