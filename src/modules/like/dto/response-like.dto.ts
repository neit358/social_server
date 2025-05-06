import { IsString } from 'class-validator';
import { CreateLikeDto } from './create-like.dto';

export class responseLikeDto extends CreateLikeDto {
  @IsString()
  id: string;
}
