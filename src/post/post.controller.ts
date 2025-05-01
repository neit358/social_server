import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  async getPostByIdCtr(@Param('id') id: string) {
    const post = await this.postService.findPostById(id);
    if (!post) throw new HttpException('Post not found', 404);
    return {
      statusCode: 200,
      message: 'Post found',
      data: post,
    };
  }

  @Get('')
  async getPostsCtr() {
    const posts = await this.postService.findPosts();
    if (!posts) throw new HttpException('Posts not found', 404);
    return {
      statusCode: 200,
      message: 'Posts found',
      data: posts,
    };
  }

  @Get('user/:id')
  async getPostsByUserIdCtr(@Param('id') id: string) {
    const posts = await this.postService.findPostsByUserId(id);
    if (!posts) throw new HttpException('Posts not found', 404);
    return {
      statusCode: 200,
      message: 'Posts found',
      data: posts,
    };
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createPostCtr(@UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
    const image = file.path;

    const postCreate = await this.postService.createPost(body, image);
    if (!postCreate) throw new HttpException('Post not created', 404);
    return {
      statusCode: 201,
      message: 'Post created',
      data: postCreate,
    };
  }

  @Delete('delete/:id')
  async deletePostCtr(@Param('id') id: string) {
    const post = await this.postService.deletePost(id);
    if (!post) throw new HttpException('Post not found', 404);
    return {
      statusCode: 200,
      message: 'Post deleted',
      data: post,
    };
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updatePostCtr(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
  ) {
    const image = file.path;
    const post = await this.postService.findPostById(id);
    if (!post) throw new HttpException('Post not found', 404);

    const postUpdate = await this.postService.updatePost(id, body, image);
    if (!postUpdate) throw new HttpException('Post not updated', 404);

    return {
      statusCode: 200,
      message: 'Post updated',
      data: postUpdate,
    };
  }
}
