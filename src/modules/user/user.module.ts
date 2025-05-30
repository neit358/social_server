import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger, Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { JwtConfigModule } from 'src/configs/jwt.config';
import { RedisService } from 'src/services/redis.service';
import { ElasticsearchModule } from 'src/configs/elasticsearch.config';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { join } from 'path';
// import { BullModule } from '@nestjs/bullmq';
// import { Queue } from 'bullmq';
// import { BullMQConsumer } from 'src/provider/bullmq/bullmq.consumer';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'HERO_SERVICE',
    //     transport: Transport.GRPC,
    //     options: {
    //       package: 'hero',
    //       protoPath: join(__dirname, '../../../../proto/api.proto'),
    //       url: 'localhost:50051',
    //     },
    //   },
    // ]),
    // BullModule.registerQueue({
    //   name: 'user',
    // }),
    TypeOrmModule.forFeature([User]),
    JwtConfigModule,
    JwtConfigModule,
    ElasticsearchModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, RedisService, Logger /*BullMQConsumer*/],
  exports: [UserService, UserRepository],
})
export class UserModule {}
