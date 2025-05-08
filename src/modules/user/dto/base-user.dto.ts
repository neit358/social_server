import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class BaseUserDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'example@gmail.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyen Van A',
  })
  name: string;
}
