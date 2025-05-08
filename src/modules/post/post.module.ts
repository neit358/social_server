import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';
import { PostRepository } from './post.repository';
import { RedisService } from 'src/services/redis.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueNameImage = uuidv4() + extname(file.originalname);
          cb(null, uniqueNameImage);
        },
      }),
    }),
    ElasticsearchModule,
    UserModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, RedisService],
  exports: [PostService],
})
export class PostModule {}
