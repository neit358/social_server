import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post.entity';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';
import { PostRepository } from './post.repository';
import { RedisService } from 'src/services/redis.service';
import { UserModule } from '../user/user.module';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { MulterConfigModule } from 'src/configs/multer.config';
// import { BeanstalkdProvider } from 'src/provider/beanstalkd/beanstalkd.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterConfigModule,
    JwtConfigModule,
    UserModule,
    ElasticsearchModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, RedisService /*BeanstalkdProvider*/],
  exports: [PostService],
})
export class PostModule {}
