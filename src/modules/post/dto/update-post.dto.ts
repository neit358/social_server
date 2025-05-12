import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Post Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Post Content' })
  @IsString()
  content: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  image: Express.Multer.File;
}
