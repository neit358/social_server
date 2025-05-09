import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty({
    description: 'Tên của người dùng',
    example: 'Nguyen Van A',
  })
  name: string;

  @ApiProperty({
    description: 'Hình ảnh đại diện của người dùng',
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar: Express.Multer.File;
}

export class UpdatePasswordUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mật khẩu cũ',
    type: 'string',
    example: 'Aa123456',
    required: true,
  })
  oldPassword?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Mật khẩu mới',
    type: 'string',
    example: 'Bb123456',
    required: true,
  })
  newPassword?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Xác nhận mật khẩu mới',
    type: 'string',
    example: 'Bb123456',
    required: true,
  })
  confirmPassword: string;
}
