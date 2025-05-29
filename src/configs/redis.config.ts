import { DynamicModule, Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { RedisService } from 'src/services/redis.service';

interface RedisModuleOptions {
  type: 'single' | 'cluster';
  url: string;
}

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: process.env.REDIS_URL,
      }),
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static register(options: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'REDIS_OPTIONS',
          useValue: options,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
