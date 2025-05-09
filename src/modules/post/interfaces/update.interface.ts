import { I_UpdatePost } from './create.interface';

export interface I_CreatePost extends I_UpdatePost {
  userId: string;
}
