import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get(':id')
  async getLikesByPostId(@Param('id') id: string) {
    return await this.likeService.getLikesByPostId(id);
  }

  @Get(':postId/:userId')
  async getLike(@Param() { postId, userId }: { postId: string; userId: string }) {
    return await this.likeService.getLike(postId, userId);
  }

  @Post('action/:id')
  async actionLike(@Param('id') postId: string, @Body() body: CreateLikeDto) {
    return await this.likeService.actionLike(body.userId, postId);
  }
}
