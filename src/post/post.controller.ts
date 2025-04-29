import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('post/:id')
  async getPostByIdCtr(@Param() id: string) {
    const post = await this.postService.findPostById(id);
    if (!post) throw new HttpException('Post not found', 404);
    return {
      statusCode: 200,
      message: 'Post found',
      post,
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

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueNameImage = uuidv4() + extname(file.originalname);
          cb(null, uniqueNameImage);
        },
      }),
    }),
  )
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
}
