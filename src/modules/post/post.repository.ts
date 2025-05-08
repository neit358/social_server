import { In, Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { I_find } from 'src/types/find.type';

export class PostRepository extends Repository<Post> {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    super(postRepository.target, postRepository.manager, postRepository.queryRunner);
  }

  async findPost(data: I_find): Promise<Post | null> {
    return await this.findOne(data);
  }

  async findPosts(data: I_find): Promise<Post[]> {
    return await this.find(data);
  }

  async findPostsBySearch(search: string): Promise<Post[]> {
    return await this.createQueryBuilder('post')
      .where('post.title LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async createPost(data: CreatePostDto & UpdatePostDto): Promise<Post> {
    const post = this.create(data);
    return await this.save(post);
  }

  async deletePost(id: string): Promise<void> {
    await this.delete(id);
  }

  async updatePost(id: string, data: Partial<UpdatePostDto>): Promise<void> {
    await this.update(id, data);
  }

  async deletePosts(listIdPost: string[]): Promise<void> {
    const posts = await this.findBy({ id: In(listIdPost) });
    if (!posts) {
      throw new Error('Posts not found');
    }

    await this.delete({
      id: In(listIdPost),
    });
  }

  async getUserLikedPostByPostId(postId: string): Promise<Post | null> {
    return await this.findOne({
      where: { id: postId },
      relations: { likes: { user: true } },
    });
  }
}
