import { HttpException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findPostById(id: string): Promise<Post | null> {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      return null;
    }
    return post;
  }

  async findPosts(): Promise<Post[]> {
    return this.postRepository.findPosts();
  }

  async findPostsByUserId(userId: string): Promise<Post[]> {
    return this.postRepository.findPostsByUserId(userId);
  }

  async findPostsBySearch(search: string): Promise<Post[]> {
    return this.postRepository.findPostsBySearch(search);
  }

  async createPost(data: CreatePostDto): Promise<Post | null> {
    const postCreated = await this.postRepository.createPost(data);
    if (!postCreated) throw new HttpException('Post not created', 400);
    const index = 'posts';
    const result = await this.postRepository.createIndex(index, postCreated);
    if (!result) {
      throw new HttpException('Post not created', 400);
    }
    return postCreated;
  }

  async deletePost(id: string): Promise<boolean | null> {
    const post = await this.findPostById(id);
    if (!post) {
      return null;
    }
    await this.postRepository.deletePost(id);
    return true;
  }

  async updatePost(id: string, data: Partial<CreatePostDto>): Promise<Post | null> {
    await this.postRepository.updatePost(id, data);
    return await this.findPostById(id);
  }

  async deletePosts(listIdPost: string[]): Promise<boolean | null> {
    const posts = await this.postRepository.deletePosts(listIdPost);
    return posts;
  }

  async getUserLikedPostsByPostId(postId: string): Promise<Post | null> {
    const post = await this.postRepository.getUserLikedPostsByPostId(postId);
    if (!post) {
      return null;
    }
    return post;
  }

  async getPostsByTitleByElasticsearch(index: string, title: string): Promise<any> {
    const query = {
      query: {
        match: {
          title,
        },
      },
    };
    const result = await this.postRepository.searchPostsByTitleByElasticsearch(index, query);
    if (!result) {
      throw new HttpException('Posts not found', 404);
    }
    return result;
  }
}

// {relations: { user: true }}
