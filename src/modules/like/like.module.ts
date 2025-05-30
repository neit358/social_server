import { Module } from '@nestjs/common';

import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikeRepository } from './like.repository';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { RedisService } from 'src/services/redis.service';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    UserModule,
    PostModule,
    JwtConfigModule,
    ElasticsearchModule,
  ],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository, RedisService],
})
export class LikeModule {}
