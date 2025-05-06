import { ApiProperty } from '@nestjs/swagger';
import { BasePostDto } from './base-post.dto';

export class CreatePostDto extends BasePostDto {
  @ApiProperty({ example: '302f87b9-2c7a-4824-921c-277b5ac3727a' })
  userId: string;
}
