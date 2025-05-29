import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import beanstalkdClient, { BeanstalkdCaller } from 'beanstalkd';
import { BeanstalkdTube } from '../constant/beanstalkd.enum';

@Injectable()
export class BeanstalkdProvider implements OnModuleInit, OnModuleDestroy {
  private client: beanstalkdClient & BeanstalkdCaller;
  constructor() {}

  async onModuleInit() {
    try {
      const client = new beanstalkdClient(
        process.env.BEANSTALKD_HOST,
        Number(process.env.BEANSTALKD_PORT),
      );

      this.client = await client.connect();
      console.log('Connected to Beanstalkd');
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

  async produce(tube: BeanstalkdTube, payload: any) {
    try {
      await this.ensureConnection();
      const jobId = await this.client.put(0, 0, 0, JSON.stringify(payload));
      console.log(`Job ${jobId} added to tube ${tube}`);
      return jobId;
    } catch (error) {
      console.error('Error ensuring connection:', error);
      throw new Error('Failed to ensure connection to Beanstalkd');
    }
  }
}
