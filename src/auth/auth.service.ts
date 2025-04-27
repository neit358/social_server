import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async login(name: string, password: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ where: { name, password } });

    if (!user) {
      return null;
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<User | null> {
    const user: User = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
