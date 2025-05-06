import { ApiProperty } from '@nestjs/swagger';
import { BasePostDto } from './base-post.dto';
import { CreatePostDto } from './create-post.dto';

export class CreatePostWithImageDto extends CreatePostDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}

export class UpdatePostWithImageDto extends BasePostDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
