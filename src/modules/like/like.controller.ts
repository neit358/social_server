import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LikeService } from './like.service';
import { BaseLikeDto } from './dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get(':id')
  async getLikesByPostId(@Param('id') id: string) {
    return await this.likeService.getLikesByPostId(id);
  }

  @Get(':postId/:userId')
  async getLike(@Param() { postId, userId }: BaseLikeDto) {
    return await this.likeService.getLike({ postId, userId });
  }

  @Post('action/:id')
  async actionLike(@Param('id') postId: string, @Body() body: BaseLikeDto) {
    return await this.likeService.actionLike({
      postId,
      userId: body.userId,
    });
  }
}
