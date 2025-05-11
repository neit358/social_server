import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreatePostDto, SearchPostDto, UpdatePostDto } from './dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  async getPostsCtr() {
    return await this.postService.findPosts();
  }

  @Get(':id')
  async getPostByIdCtr(@Param('id') id: string) {
    return await this.postService.findPostById(id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  async getPostsByUserIdCtr(@Param('id') id: string) {
    return await this.postService.findPostsByUserId(id);
  }

  @Get('search/elastic')
  async getPostsByTitleByElasticsearch(@Query() { title }: SearchPostDto) {
    return await this.postService.getPostsByTitleByElasticsearch(title);
  }

  @Get('search/:search')
  async getPostsBySearchCtr(@Param('search') search: string) {
    return await this.postService.findPostsBySearch(search);
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  async createPostCtr(@UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
    const image = file?.path;
    return await this.postService.createPost(image, body);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  async deletePostCtr(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard)
  async updatePostCtr(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
  ) {
    const image = file?.path;
    return await this.postService.updatePost(id, { ...body, image });
  }

  @Post('delete/list')
  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'Dữ liệu xóa nhiều bài viết',
    schema: {
      type: 'object',
      properties: {
        listPostId: {
          type: 'array',
          items: {
            type: 'string',
          },
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
  @UseGuards(AuthGuard)
  async getUserLikedPostsByPostId(@Param('id') id: string) {
    return await this.postService.getUserLikedPostByPostId(id);
  }
}
