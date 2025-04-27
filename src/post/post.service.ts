import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async findPostById(id: number): Promise<Post | null> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      return null;
    }
    return post;
  }

  async findPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }
}
