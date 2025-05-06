import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LikeModule } from './modules/like/like.module';
import { PostModule } from './modules/post/post.module';
import { RedisModule } from './configs/redis.config';
import { Post } from './modules/post/entities/post.entity';
import { Like } from './modules/like/entities/like.entity';
import { ElasticsearchModule } from './configs/elasticsearch.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Post, Like],
      synchronize: true,
    }),
    UserModule,
    PostModule,
    AuthModule,
    LikeModule,
    RedisModule,
    ElasticsearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
