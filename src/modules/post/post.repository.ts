import { In, Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import BaseAbstractRepository from 'src/repositories/base.abstract.repository';
import { I_PostRepository } from './interfaces/post.repository.interface';

export class PostRepository extends BaseAbstractRepository<Post> implements I_PostRepository {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    super(postRepository);
  }

  async findPostsBySearch(search: string): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.title LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async deletePosts(listIdPost: string[]): Promise<void> {
    const posts = await this.postRepository.findBy({ id: In(listIdPost) });
    if (!posts) {
      throw new Error('Posts not found');
    }

    await this.postRepository.delete({
      id: In(listIdPost),
    });
  }
}
