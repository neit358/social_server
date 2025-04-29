import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async findPostById(id: string): Promise<Post | null> {
    const post = await this.postRepository.findOneBy({ id: id.toString() });

    if (!post) {
      return null;
    }
    return post;
  }

  async findPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async createPost(data: CreatePostDto, image: string): Promise<Post | null> {
    const urlImage =
      (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    const post = this.postRepository.create({ ...data, image: urlImage });
    return this.postRepository.save(post);
  }
}

// {relations: { user: true }}
