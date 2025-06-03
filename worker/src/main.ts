import { NestFactory } from '@nestjs/core';
import { EventEmitter } from 'events';
import { WorkerModule } from './worker.module';

EventEmitter.defaultMaxListeners = 20;

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });
  await app.init();
}

bootstrap();
