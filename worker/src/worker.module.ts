import { Module } from '@nestjs/common';
import { HandlePutBaseWorker } from './handle-create-base';
import { BeanstalkdTube } from 'src/provider/constant/beanstalkd.enum';

@Module({
  providers: [
    {
      provide: 'BASE_TUBE',
      useValue: BeanstalkdTube.base,
    },
    HandlePutBaseWorker,
  ],
})
export class WorkerModule {}
