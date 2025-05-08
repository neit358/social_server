import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @IsString()
  @ApiProperty({
    description: 'Mật khẩu của người dùng',
    example: '123456',
  })
  password: string;
}
