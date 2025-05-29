import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'notifications',
    timeZone: 'Europe/Paris',
  })
  triggerNotifications() {
    console.log('Cron job for notifications triggered at:', new Date().toISOString());
  }
}
