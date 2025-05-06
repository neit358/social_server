import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import {
  CreatePostDto,
  CreatePostWithImageDto,
  UpdatePostDto,
  UpdatePostWithImageDto,
} from './dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  async getPostByIdCtr(@Param('id') id: string) {
    return await this.postService.findPostById(id);
  }

  @Get('')
  async getPostsCtr() {
    return await this.postService.findPosts();
  }

  @Get('user/:id')
  async getPostsByUserIdCtr(@Param('id') id: string) {
    return await this.postService.findPostsByUserId(id);
  }

  @Get('search/:search')
  async getPostsBySearchCtr(@Param('search') search: string) {
    return await this.postService.findPostsBySearch(search);
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dữ liệu tạo bài viết',
    type: CreatePostWithImageDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createPostCtr(@UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
    const image = file?.path;
    return await this.postService.createPost(image, body);
  }

  @Delete('delete/:id')
  async deletePostCtr(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dữ liệu cập nhật bài viết',
    type: UpdatePostWithImageDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async updatePostCtr(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
  ) {
    const image = file?.path;
    return await this.postService.updatePost(id, body, image);
  }

  @Post('delete/list')
  @ApiBody({
    description: 'Dữ liệu xóa nhiều bài viết',
    schema: {
      type: 'object',
      properties: {
        listPostId: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  async deletePostsCtr(
    @Body()
    body: {
      listPostId: string[];
    },
  ) {
    return await this.postService.deletePosts(body.listPostId);
  }

  @Get('user/list/:id')
  async getUserLikedPostsByPostId(@Param('id') id: string) {
    return await this.postService.getUserLikedPostByPostId(id);
  }

  @Get('search/:index/:title')
  @ApiParam({
    name: 'title',
    description: 'Title search in Elasticsearch',
    required: true,
  })
  @ApiParam({
    name: 'index',
    description: 'Name index in Elasticsearch',
    required: true,
  })
  async getPostsByTitleByElasticsearch(
    @Param() { index, title }: { index: string; title: string },
  ) {
    return await this.postService.getPostsByTitleByElasticsearch(index, title);
  }
}
