import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeDto } from './dto/like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get(':id')
  async getLikesByPostId(@Param('id') id: string) {
    const likes = await this.likeService.getLikesByPostId(id);
    if (!likes) throw new HttpException('Likes not found', 404);
    return { statusCode: 200, message: 'Likes found', data: likes };
  }

  @Get(':postId/:userId')
  async getLikeById(@Param('postId') postId: string, @Param('userId') userId: string) {
    const like = await this.likeService.getLikeById(postId, userId);
    if (!like) throw new HttpException('Like not found', 404);
    return { statusCode: 200, message: 'Like found', data: like };
  }

  @Post('action/:id')
  async actionLike(@Param('id') postId: string, @Body() body: LikeDto) {
    const like = await this.likeService.actionLike(body.userId, postId);
    if (!like) throw new HttpException('Like already exists', 404);
    return { statusCode: 200, message: 'Like created', data: like };
  }
}
