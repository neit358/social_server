import { Inject, Injectable } from '@nestjs/common';
import { BaseBeanstalkdConsumer } from 'src/provider/beanstalkd/beanstalkd.consumer';
import { BeanstalkdTube } from 'src/provider/constant/beanstalkd.enum';

@Injectable()
export class HandlePutBaseWorker extends BaseBeanstalkdConsumer {
  constructor(@Inject('BASE_TUBE') tube: BeanstalkdTube) {
    super(tube);
  }

  handler(payload: any): Promise<boolean> {
    console.log('Default handler invoked with payload base:', payload);
    return Promise.resolve(true);
  }
}
