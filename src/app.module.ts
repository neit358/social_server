import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { ChatModule } from './chat/chat.module';
import { RedisModule } from './configs/redis.config';
import { AuthModule } from './modules/auth/auth.module';
import { LikeModule } from './modules/like/like.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { User } from './modules/user/entities/user.entity';
import { Post } from './modules/post/entities/post.entity';
import { Like } from './modules/like/entities/like.entity';
import { ElasticsearchModule } from './configs/elasticsearch.config';
// import { NotificationService } from './services/schedule.service';

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
      // ssl: {
      //   rejectUnauthorized: false,
      // }, // Enable SSL for production
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    PostModule,
    AuthModule,
    LikeModule,
    RedisModule,
    ElasticsearchModule,
    ChatModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    /*, NotificationService*/
  ],
})
export class AppModule /* implements NestModule */ {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(CommonMiddleware).forRoutes('*');
  // }
}
