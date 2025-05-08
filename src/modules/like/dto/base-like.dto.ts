import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseLikeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of post',
    example: '1234567890abcdef12345678',
  })
  postId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of user',
    example: '1234567890abcdef12345678',
  })
  userId: string;
}
