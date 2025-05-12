import { ApiProperty } from '@nestjs/swagger';
import { UpdatePostDto } from './update-post.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto extends UpdatePostDto {
  @ApiProperty({ example: '302f87b9-2c7a-4824-921c-277b5ac3727a' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
