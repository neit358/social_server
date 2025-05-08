import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsObject, IsString, Length } from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto';

export class VerifyRegisterDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email của người dùng',
    example: 'exmaple@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mã xác thực',
    example: '123456',
  })
  @Length(6)
  code: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Thông tin người dùng',
    type: CreateUserDto,
  })
  createUserDto: CreateUserDto;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Key of Redis',
    example: 'example@gmail.com',
  })
  key: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Time to live of Redis',
    example: 60,
  })
  seconds: number;
}
