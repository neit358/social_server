import { ClientGrpc } from '@nestjs/microservices';
import { Injectable, HttpException, Inject, Logger } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UpdatePasswordUserDto, UpdateUserDto } from './dto/update-user.dto';
import { omit } from 'lodash';
import { I_Base_Response } from 'src/interfaces/response.interfaces';
import { lastValueFrom } from 'rxjs';
import { Hero, HeroById, HeroesService } from './interfaces/hero.interface';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronTime } from 'cron';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class UserService {
  private heroesService: HeroesService;
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('HERO_SERVICE') private client: ClientGrpc,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly logger: Logger,
    @InjectQueue('user') private readonly userQueue: Queue,
  ) {
    this.heroesService = this.client.getService<HeroesService>('HeroesService');
  }

  async findUserById(id: string): Promise<I_Base_Response<User>> {
    try {
      const user = await this.userRepository.findOneById({ id });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async findUsers(): Promise<I_Base_Response<User[]>> {
    try {
      const users = await this.userRepository.findAll({});
      if (!users) throw new HttpException('Users not found', 404);
      return {
        statusCode: 200,
        message: 'Get users successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async updateUser(
    id: string,
    updateUser: UpdateUserDto,
    avatar?: string,
  ): Promise<Partial<I_Base_Response<User>>> {
    try {
      const user = await this.userRepository.findOneById({ id });

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      let urlAvatar: string | null = null;

      if (avatar) {
        urlAvatar =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          avatar;
      }

      await this.userRepository.update(id, {
        ...updateUser,
        avatar: urlAvatar || user.avatar,
      });

      return {
        statusCode: 200,
        message: 'User updated successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async updatePasswordCtr(
    id: string,
    data: UpdatePasswordUserDto,
  ): Promise<I_Base_Response<Partial<User>>> {
    try {
      const { oldPassword, newPassword, confirmPassword } = data;
      const user: User | null = await this.userRepository.findOneById({ id });
      if (!user) throw new HttpException('User not found', 404);
      if (user.password !== oldPassword) throw new HttpException('Old password is incorrect', 400);
      if (newPassword !== confirmPassword)
        throw new HttpException('Password and confirm password are not the same', 400);
      if (newPassword === oldPassword)
        throw new HttpException('New password is the same as old password', 400);
      await this.userRepository.update(id, {
        password: newPassword,
      });
      const userUpdated: User | null = await this.userRepository.findOneById({ id });
      if (!userUpdated) throw new HttpException('User not found', 404);

      const userWithoutPassword = omit(userUpdated, ['password']);
      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: userWithoutPassword,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOneById({ id });
      if (!user) throw new HttpException('User not found', 404);
      await this.userRepository.remove(user);
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async getHeroFromMicroservices({ id }: HeroById): Promise<I_Base_Response<Hero>> {
    try {
      const Hero = await lastValueFrom(this.heroesService.findOne({ id: Number(id) }));
      if (!Hero) throw new HttpException('Heros not found', 404);
      return {
        statusCode: 200,
        message: 'Get heroes successfully',
        data: Hero,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  // @Cron('0 * * * * *') // Every minute, 5th second
  // @Cron(CronExpression.EVERY_10_SECONDS) every 10 seconds
  // async scheduleGetData(): Promise<Partial<I_Base_Response>> {
  //   try {
  //     const Users = await this.findUsers();
  //     if (!Users) throw new HttpException('Users not found', 404);
  //     console.log('Users fetched successfully:', Users.data);
  //     return {
  //       statusCode: 200,
  //       message: 'Get data successfully',
  //     };
  //   } catch (error) {
  //     throw new HttpException((error as Error).message, 404);
  //   }
  // }

  // @Interval('notifications', 2500) // Every 2.5 seconds
  @Timeout('notifications', 5000) // To 5 seconds
  async scheduleGetData(): Promise<Partial<I_Base_Response>> {
    try {
      // console.log('Timeout job for notifications triggered at:', new Date().toISOString());
      // await this.userQueue.add(
      //   'example-job',
      //   {
      //     foo: 'bar',
      //   },
      //   { delay: 3000 },
      // );
      // console.log('Timeout job for notifications triggered at:', new Date().toISOString());
      // this.addInterval('listUser', 5000);
      // setTimeout(() => {
      //   this.clearInterval('listUser');
      // }, 15000);
      // const job = this.schedulerRegistry.getCronJob('notifications');
      // job.setTime(new CronTime('*/4 * * * * *')); // mỗi 15 giây
      const Users = await this.findUsers();
      if (!Users) throw new HttpException('Users not found', 404);
      return {
        statusCode: 200,
        message: 'Get data successfully',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  addTimeout(name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`Timeout ${name} executing after (${milliseconds})!`);
    };

    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  clearTimeout(name: string) {
    console.log(`Clearing timeout: ${name}`);
    const timeout = this.schedulerRegistry.getTimeout(name);
    clearTimeout(timeout);
    this.schedulerRegistry.deleteTimeout(name);
  }

  addInterval(name: string, milliseconds: number) {
    const callback = () => {
      this.logger.warn(`Interval ${name} executing after (${milliseconds})!`);
    };

    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);
  }

  clearInterval(name: string) {
    console.log(`Clearing interval: ${name}`);
    const interval = this.schedulerRegistry.getInterval(name);
    clearInterval(interval);
    this.schedulerRegistry.deleteInterval(name);
  }
}

// cache user
