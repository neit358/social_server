import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({ example: 'Post Title' })
  title: string;

  @ApiProperty({ example: 'Post Content' })
  content: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
