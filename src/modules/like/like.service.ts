import { HttpException, Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';
import { I_Base_Response } from 'src/types/response.type';
@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async getLike(postId: string, userId: string): Promise<I_Base_Response<Like>> {
    try {
      const like = await this.likeRepository.getLike(postId, userId);
      console.log('like', like);
      if (!like) throw new HttpException('Like not found', 404);
      return { statusCode: 200, message: 'Like found', data: like };
    } catch {
      throw new HttpException('Like not found', 404);
    }
  }

  async getLikesByPostId(postId: string): Promise<I_Base_Response<Like[]>> {
    try {
      const likes = await this.likeRepository.getLikesByPostId(postId);
      if (!likes) throw new HttpException('Likes not found', 404);
      return { statusCode: 200, message: 'Likes found', data: likes };
    } catch {
      throw new HttpException('Likes not found', 404);
    }
  }

  async actionLike(userId: string, postId: string): Promise<Partial<I_Base_Response<Like>>> {
    try {
      const liked = await this.getLike(userId, postId);
      if (liked) {
        await this.likeRepository.deleteLike(userId, postId);
        return { statusCode: 200, message: 'Like deleted' };
      }
      const response = await this.likeRepository.createLike(userId, postId);
      if (!response) {
        throw new HttpException('Like not found', 404);
      }
      return { statusCode: 200, message: 'Like created', data: response };
    } catch {
      throw new HttpException('Like not found', 404);
    }
  }
}
