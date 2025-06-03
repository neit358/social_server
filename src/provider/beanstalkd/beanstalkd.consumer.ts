import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import BeanstalkdClient, { BeanstalkdCaller } from 'beanstalkd';
import { BeanstalkdTube } from '../constant/beanstalkd.enum';

@Injectable()
export class BaseBeanstalkdConsumer implements OnModuleInit, OnModuleDestroy {
  private client: BeanstalkdClient & BeanstalkdCaller;
  private tube: BeanstalkdTube;
  constructor(tube: BeanstalkdTube) {
    this.tube = tube;
  }

  async onModuleInit() {
    try {
      const client = new BeanstalkdClient(
        process.env.BEANSTALKD_HOST,
        Number(process.env.BEANSTALKD_PORT),
      );

      this.client = await client.connect();
      console.log('Connected to Beanstalkd');
      this.startConsumer();
    } catch (error) {
      console.log('Error connecting to Beanstalkd:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Error disconnecting from Beanstalkd:', error);
      throw new Error('Failed to disconnect from Beanstalkd');
    }
  }

  startConsumer() {
    console.log('Starting Beanstalkd consumer...');
    const consumerJobs = async () => {
      while (true) {
        try {
          await this.consume();
        } catch (error) {
          console.error('Error consuming job:', error);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    void consumerJobs();
  }

  handler(payload: any): Promise<boolean> {
    console.log('Default handler invoked with payload:', payload);
    return Promise.resolve(true);
  }

  async consume() {
    await this.ensureConnection();
    await this.client.watch(this.tube);
    let id, payload;

    try {
      [id, payload] = await this.client.reserve();

      if (!id || !payload) {
        return;
      }
      console.log('Job reserved:', id, payload);
      const bool = await this.handler(payload);
      console.log(bool);
      if (!bool) {
        return;
      }
      await this.client.delete(Number(id));
    } catch (error) {
      if ((error as Error).message == 'DEADLINE_SOON') {
        console.log('No jobs available, retrying...');
        return;
      }
      throw error;
    }
  }

  async ensureConnection() {
    if (!this.client) {
      throw new Error('Beanstalkd client is not connected');
    }
    try {
      await this.client.listTubes();
    } catch (error) {
      console.error('Error ensuring connection:', error);
      await this.onModuleInit();
    }
  }
}
