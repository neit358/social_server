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

  @Get('search/:search')
  async getPostsBySearchCtr(@Param('search') search: string) {
    const posts = await this.postService.findPostsBySearch(search);
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
    const image = file?.path;
    let urlImage: string | null = null;
    if (image) {
      urlImage =
        (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    }
    const postCreate = await this.postService.createPost({ ...body, image: urlImage || '' });
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
    const image = file?.path;
    const post = await this.postService.findPostById(id);
    if (!post) throw new HttpException('Post not found', 404);

    let urlImage: string | null = null;

    if (image) {
      urlImage =
        (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    }
    const postUpdate = await this.postService.updatePost(id, {
      ...body,
      image: urlImage || post.image,
    });
    if (!postUpdate) throw new HttpException('Post not updated', 404);

    return {
      statusCode: 200,
      message: 'Post updated',
      data: postUpdate,
    };
  }

  @Post('delete/list')
  async deletePostsCtr(
    @Body()
    body: {
      listPostId: string[];
    },
  ) {
    const postsDeleted = await this.postService.deletePosts(body.listPostId);
    if (!postsDeleted) throw new HttpException('Posts not found', 404);
    return {
      statusCode: 200,
      message: 'Posts deleted',
      data: postsDeleted,
    };
  }

  @Get('user/list/:id')
  async getUserLikedPostsByPostId(@Param('id') id: string) {
    const posts = await this.postService.getUserLikedPostsByPostId(id);
    if (!posts) throw new HttpException('Posts not found', 404);
    return {
      statusCode: 200,
      message: 'Posts found',
      data: posts,
    };
  }

  @Get('search/:index/:title')
  async getPostsByTitleByElasticsearch(
    @Param() { index, title }: { index: string; title: string },
  ) {
    const result = await this.postService.getPostsByTitleByElasticsearch(index, title);
    if (!result) throw new HttpException('Posts not found', 404);
    return {
      statusCode: 200,
      message: 'Posts found',
      data: result.hits.hits,
    };
  }
}
