import { HttpException, Injectable } from '@nestjs/common';

import { LikeRepository } from './like.repository';
import { Like } from './entities/like.entity';
import { I_Base_Response } from 'src/types/response.type';
import { BaseLikeDto } from './dto';
import { LikeResponseDto } from './dto/response.dto';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly postService: PostService,
    private userService: UserService,
  ) {}

  async getLike({ postId, userId }: BaseLikeDto): Promise<I_Base_Response<LikeResponseDto>> {
    try {
      const like = await this.likeRepository.getLike(postId, userId);
      if (!like)
        return {
          statusCode: 200,
          message: 'Like found',
          data: {
            isLiked: false,
          },
        };
      return {
        statusCode: 200,
        message: 'Like found',
        data: {
          isLiked: true,
        },
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async getLikesByPostId(postId: string): Promise<I_Base_Response<Like[]>> {
    try {
      const likes = await this.likeRepository.getLikesByPostId(postId);
      if (!likes) throw new HttpException('Likes not found', 404);
      return { statusCode: 200, message: 'Likes found', data: likes };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async actionLike({
    postId,
    userId,
  }: BaseLikeDto): Promise<Partial<I_Base_Response<LikeResponseDto>>> {
    try {
      const post = await this.postService.findPostById(postId);
      if (!post) throw new HttpException('Post not found', 404);

      const user = await this.userService.findUserById(userId);
      if (!user) throw new HttpException('User not found', 404);

      const liked = await this.getLike({ postId, userId });
      if (liked.data.isLiked) {
        await this.likeRepository.deleteLike(postId, userId);
        return {
          statusCode: 200,
          message: 'Like deleted',
          data: {
            isLiked: false,
          },
        };
      }
      const response = await this.likeRepository.createLike(postId, userId);
      if (!response) {
        throw new HttpException('Like not found', 404);
      }
      return {
        statusCode: 200,
        message: 'Like created',
        data: {
          isLiked: true,
        },
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }
}
