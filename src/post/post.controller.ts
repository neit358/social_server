import { Controller, HttpException } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  async findPostByIdCtr(id: number) {
    const post = await this.postService.findPostById(id);
    if (!post) throw new HttpException('Post not found', 404);
    return post;
  }

  async findPostsCtr() {
    return await this.postService.findPosts();
  }
}
