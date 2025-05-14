import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { RedisService } from 'src/services/redis.service';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtConfigModule,
    JwtConfigModule,
    ElasticsearchModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, RedisService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
