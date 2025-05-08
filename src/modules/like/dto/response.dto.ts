import { IsBoolean } from 'class-validator';

export class LikeResponseDto {
  @IsBoolean()
  isLiked: boolean;
}
