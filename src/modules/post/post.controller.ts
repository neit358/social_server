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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as fs from 'fs';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { PostService } from './post.service';
import * as path from 'path';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DeletePostDto } from './dto/delete-post.dto';
import { CreatePostDto, SearchPostDto, UpdatePostDto } from './dto';
import { CommonInterceptor } from 'src/interceptor/common.interceptor';
import { RolesGuard } from 'src/guards/role/role.guard';
import { Roles } from 'src/guards/role/role.decorator';
import { Role } from 'src/guards/role/role.enum';
import { Permissions } from 'src/guards/permission/permission.decorator';
import { Permission } from 'src/guards/permission/permission.enum';
import { PermissionGuard } from 'src/guards/permission/permission.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  // @UseInterceptors(CommonInterceptor)
  async getPostsCtr() {
    return await this.postService.findPosts();
  }

  @Get(':id')
  // @UsePipes(CommonPipe)
  async getPostByIdCtr(@Param('id') id: string) {
    return await this.postService.findPostById(id);
  }

  @Get('user/:id')
  async getPostsByUserIdCtr(@Param('id') id: string) {
    return await this.postService.findPostsByUserId(id);
  }

  @Get('elastic/user/:id')
  async getPostsByUserIdByElasticsearch(@Param('id') id: string) {
    return await this.postService.getPostsConditionByElasticsearch('userId', `${id || ''}`);
  }

  @Get('elastic/search')
  async getPostsByTitleByElasticsearch(@Query() { title }: SearchPostDto) {
    return await this.postService.getPostsConditionByElasticsearch('title', `*${title || ''}*`);
  }

  @Get('search/:search')
  async getPostsBySearchCtr(@Param('search') search: string) {
    return await this.postService.findPostsBySearch(search);
  }

  @Get('upload/merge-file')
  @UseInterceptors(CommonInterceptor)
  mergeFileLarge(@Query() { name }: { name: string }) {
    const nameDir = `uploads/chunks-${name}`;
    const files = fs.readdirSync(nameDir).sort((a, b) => {
      const getChunkIndex = (filename: string) => parseInt(filename.split('-').pop() || '0');
      return getChunkIndex(a) - getChunkIndex(b);
    });

    let startPos = 0,
      countFile = 0;

    files.map((file) => {
      const filePath = path.join(nameDir, file);
      const streamFile = fs.createReadStream(filePath);
      fs.mkdirSync(`uploads/merge`, { recursive: true });
      const mergedFilePath = `uploads/merge/${name}`;
      fs.writeFileSync(mergedFilePath, Buffer.alloc(0));
      streamFile
        .pipe(fs.createWriteStream(`${mergedFilePath}`, { flags: 'r+', start: startPos }))
        .on('finish', () => {
          countFile++;
          if (countFile === files.length) {
            fs.rmSync(nameDir, { recursive: true, force: true });
          }
        });
      startPos += fs.statSync(filePath).size;
    });

    return {
      statusCode: 200,
      message: 'Merge file success',
    };
  }

  @Post('upload/file-large')
  @UseInterceptors(CommonInterceptor)
  @UseInterceptors(FilesInterceptor('files', 20, { dest: './uploads' }))
  uploadFileLarge(
    @UploadedFiles() file: Array<Express.Multer.File>,
    @Body() { name }: { name: string },
  ) {
    const nameDir = `uploads/chunks-${name.match(/(.+)-\d+$/)?.[1] ?? name}`;

    if (!fs.existsSync(nameDir)) {
      fs.mkdirSync(nameDir, { recursive: true });
    }

    fs.cpSync(file[0].path, `${nameDir}/${name}`);

    fs.rmSync(file[0].path, { recursive: true, force: true });

    return {
      statusCode: 200,
      message: 'Upload file success',
    };
  }

  @Post('upload/not-chunk')
  @UseInterceptors(CommonInterceptor)
  @UseInterceptors(FileInterceptor('files', { dest: './uploads' }))
  uploadFileNotChunk(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      statusCode: 200,
      message: 'Upload file success',
    };
  }

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        const extName = path.extname(file.originalname);
        const allowedTypes = ['.jpeg', '.png', '.gif'];
        if (allowedTypes.includes(extName)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
        }
      },
    }),
  )
  @ApiBearerAuth()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async createPostCtr(@UploadedFile() file: Express.Multer.File, @Body() body: CreatePostDto) {
    const image = file?.path;
    return await this.postService.createPost(image, body);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionGuard)
  @Permissions(Permission.Delete)
  async deletePostCtr(@Param('id') id: string) {
    return await this.postService.deletePost(id);
  }

  @Patch('update/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deletePostsCtr(@Query() query: DeletePostDto) {
    return await this.postService.deletePosts(query.listPostId);
  }

  @Get('user/list/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getUserLikedPostsByPostId(@Param('id') id: string) {
    return await this.postService.getUserLikedPostByPostId(id);
  }
}
