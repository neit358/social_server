import { HttpException, Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BasePostDto } from './dto';
import { I_Base_Response, I_ResponseElasticsearch } from 'src/types/response.type';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findPostById(id: string): Promise<I_Base_Response<Post>> {
    const post = await this.postRepository.findPostById(id);

    if (!post) throw new HttpException('Post not found', 404);
    return {
      statusCode: 200,
      message: 'Post found',
      data: post,
    };
  }

  async findPosts(): Promise<I_Base_Response<Post[]>> {
    try {
      const posts = await this.postRepository.findPosts();
      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }

  async findPostsByUserId(userId: string): Promise<I_Base_Response<Post[]>> {
    try {
      const posts = await this.postRepository.findPostsByUserId(userId);

      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }

  async findPostsBySearch(search: string): Promise<I_Base_Response<Post[]>> {
    try {
      const posts = await this.postRepository.findPostsBySearch(search);
      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }

  async createPost(image: string, data: CreatePostDto): Promise<I_Base_Response> {
    try {
      let urlImage: string | null = null;
      if (image) {
        urlImage =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          image;
      }

      const postCreated = await this.postRepository.createPost({ ...data, image: urlImage || '' });
      if (!postCreated) throw new HttpException('Post not created', 400);
      const index = 'posts';
      const postCreate = await this.postRepository.createIndex(index, postCreated);
      if (!postCreate) throw new HttpException('Post not created', 404);
      return {
        statusCode: 201,
        message: 'Post created',
        data: postCreate,
      };
    } catch {
      throw new HttpException('Post not created', 400);
    }
  }

  async deletePost(id: string): Promise<Partial<I_Base_Response>> {
    try {
      const post = await this.findPostById(id);
      if (!post) {
        throw new HttpException('Post not found', 404);
      }
      await this.postRepository.deletePost(id);
      return {
        statusCode: 200,
        message: 'Post deleted',
      };
    } catch {
      throw new HttpException('Post not found', 404);
    }
  }

  async updatePost(
    id: string,
    body: BasePostDto,
    image: string,
  ): Promise<Partial<I_Base_Response>> {
    try {
      const post = await this.postRepository.findPostById(id);
      if (!post) throw new HttpException('Post not found', 404);

      let urlImage: string | null = null;

      if (image) {
        urlImage =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          image;
      }
      await this.postRepository.updatePost(id, {
        ...body,
        image: urlImage || post.image,
      });

      return {
        statusCode: 200,
        message: 'Post updated',
      };
    } catch {
      throw new HttpException('Post not found', 404);
    }
  }

  async deletePosts(listIdPost: string[]): Promise<Partial<I_Base_Response>> {
    try {
      await this.postRepository.deletePosts(listIdPost);
      return {
        statusCode: 200,
        message: 'Posts deleted',
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }

  async getUserLikedPostByPostId(postId: string): Promise<I_Base_Response<Post>> {
    try {
      const posts = await this.postRepository.getUserLikedPostByPostId(postId);
      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }

  async getPostsByTitleByElasticsearch(
    index: string,
    title: string,
  ): Promise<I_Base_Response<I_ResponseElasticsearch<Post[]>>> {
    try {
      const query = {
        query: {
          query_string: {
            default_field: 'title',
            query: `*${title}*`,
          },
        },
      };
      const result = await this.postRepository.searchPostsByTitleByElasticsearch(index, query);

      if (!result) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: result,
      };
    } catch {
      throw new HttpException('Posts not found', 404);
    }
  }
}

// {relations: { user: true }}
