import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  avatar: string;
}

export class UpdatePasswordUserDto {
  @IsString()
  oldPassword: string;
  @IsString()
  newPassword: string;
  @IsString()
  confirmPassword: string;
}
