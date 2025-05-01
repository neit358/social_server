import { UpdatePostDto } from './update-post.dto';

export interface CreatePostDto extends UpdatePostDto {
  userId: string;
}
