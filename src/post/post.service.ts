import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
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

  async createPost(data: CreatePostDto, image: string): Promise<Post | null> {
    const urlImage =
      (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    const post = this.postRepository.create({ ...data, image: urlImage });
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

  async updatePost(id: string, data: Partial<CreatePostDto>, image: string): Promise<Post | null> {
    const urlImage =
      (process.env.HOST ?? 'http://localhost') + ':' + (process.env.PORT ?? '3001') + '/' + image;
    await this.postRepository.update(id, {
      ...data,
      image: urlImage,
    });
    return await this.findPostById(id);
  }
}

// {relations: { user: true }}
