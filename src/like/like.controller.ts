import { Controller, Delete, HttpException, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('create')
  async createLike(userId: string, postId: string) {
    const like = await this.likeService.createLike(userId, postId);
    if (!like) throw new HttpException('Like already exists', 404);
    return { statusCode: 200, message: 'Like created', like };
  }

  @Delete('delete')
  async deleteLike(userId: string, postId: string) {
    const like = await this.likeService.deleteLIke(userId, postId);
    if (!like) throw new HttpException('Like not found', 404);
    return { statusCode: 200, message: 'Like deleted', like };
  }
}
