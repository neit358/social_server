import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async findPostById(id: string): Promise<Post | null> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      return null;
    }
    return post;
  }

  async findPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findPostsByUserId(userId: string): Promise<Post[]> {
    return this.postRepository.find({ where: { userId } });
  }

  async findPostsBySearch(search: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('post')
      .where('post.title LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async createPost(data: CreatePostDto): Promise<Post | null> {
    const post = this.postRepository.create(data);
    return this.postRepository.save(post);
  }

  async deletePost(id: string): Promise<boolean | null> {
    const post = await this.findPostById(id);
    if (!post) {
      return null;
    }
    await this.postRepository.delete(id);
    return true;
  }

  async updatePost(id: string, data: Partial<CreatePostDto>): Promise<Post | null> {
    await this.postRepository.update(id, data);
    return await this.findPostById(id);
  }

  async deletePosts(listIdPost: string[]): Promise<boolean | null> {
    const posts = await this.postRepository.findBy({ id: In(listIdPost) });
    if (!posts) {
      return null;
    }
    await this.postRepository.delete({
      id: In(listIdPost),
    });
    return true;
  }
}

// {relations: { user: true }}
