import { I_BaseInterfaceRepository } from 'src/repositories/base.interface.repository';
import { Post } from '../entities/post.entity';

export interface I_PostRepository extends I_BaseInterfaceRepository<Post> {
  findPostsBySearch(title: string): Promise<Post[]>;
  deletePosts(listIdPost: string[]): Promise<void>;
}
