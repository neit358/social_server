import { ApiProperty } from '@nestjs/swagger';

export class BasePostDto {
  @ApiProperty({ example: 'Post Title' })
  title: string;

  @ApiProperty({ example: 'Post Content' })
  content: string;
}
