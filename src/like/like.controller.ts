import { Controller, Delete, Get, HttpException, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get(':id')
  async getLikesByPostId(@Param('id') id: string) {
    const likes = await this.likeService.getLikesByPostId(id);
    if (!likes) throw new HttpException('Likes not found', 404);
    return { statusCode: 200, message: 'Likes found', data: likes };
  }

  @Post('create')
  async createLike(userId: string, postId: string) {
    const like = await this.likeService.createLike(userId, postId);
    if (!like) throw new HttpException('Like already exists', 404);
    return { statusCode: 200, message: 'Like created', data: like };
  }

  @Delete('delete')
  async deleteLike(userId: string, postId: string) {
    const like = await this.likeService.deleteLIke(userId, postId);
    if (!like) throw new HttpException('Like not found', 404);
    return { statusCode: 200, message: 'Like deleted', data: like };
  }
}
