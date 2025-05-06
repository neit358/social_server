import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikeController],
  providers: [LikeService, LikeRepository],
})
export class LikeModule {}
