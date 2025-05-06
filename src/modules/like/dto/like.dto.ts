import { IsString } from 'class-validator';

export class LikeDto {
  @IsString()
  postId: string;

  @IsString()
  userId: string;
}
