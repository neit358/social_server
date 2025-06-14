import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { PostRepository } from './post.repository';
import { PostController } from './post.controller';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { RedisService } from 'src/services/redis.service';
import { MulterConfigModule } from 'src/configs/multer.config';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';
import { BeanstalkdProvider } from 'src/provider/beanstalkd/beanstalkd.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterConfigModule,
    JwtConfigModule,
    UserModule,
    ElasticsearchModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, RedisService, BeanstalkdProvider],
  exports: [PostService],
})
export class PostModule {}
