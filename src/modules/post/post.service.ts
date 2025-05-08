import { HttpException, Injectable } from '@nestjs/common';

import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BasePostDto } from './dto';
import { I_Base_Response } from 'src/types/response.type';
import { RedisService } from 'src/services/redis.service';
import { SearchService } from 'src/services/elasticsearch.services';
import { UserService } from '../user/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly redisService: RedisService,
    private readonly elasticsearchService: SearchService,
    private readonly userService: UserService,
  ) {}

  async findPostById(id: string): Promise<I_Base_Response<Post>> {
    try {
      const post = await this.postRepository.findPost({
        where: {
          id,
        },
      });
      if (!post) throw new HttpException('Post not found', 404);

      await this.redisService.set(id, JSON.stringify(post));

      return {
        statusCode: 200,
        message: 'Post found',
        data: post,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async findPosts(): Promise<I_Base_Response<Post[]>> {
    try {
      const posts = await this.postRepository.findPosts({
        relations: {
          user: true,
        },
      });
      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async findPostsByUserId(userId: string): Promise<I_Base_Response<Post[]>> {
    try {
      const posts = await this.postRepository.findPosts({
        where: {
          userId,
        },
        relations: {
          user: true,
        },
      });

      if (!posts) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: posts,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
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
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async createPost(image: string, data: CreatePostDto): Promise<I_Base_Response> {
    try {
      const user = await this.userService.findUserById(data.userId);
      if (!user) throw new HttpException('User not found', 404);

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

      await this.redisService.set(postCreated.id, JSON.stringify(postCreated));

      await this.elasticsearchService.createIndex('posts', postCreated);

      return {
        statusCode: 201,
        message: 'Post created',
        data: postCreated,
      };
    } catch {
      throw new HttpException('Post not created', 400);
    }
  }

  async updatePost(
    id: string,
    body: BasePostDto,
    image: string,
  ): Promise<Partial<I_Base_Response>> {
    try {
      const post = await this.postRepository.findPost({
        where: {
          id,
        },
        relations: {
          user: true,
        },
      });
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

      const dataUpdate = {
        ...body,
        image: urlImage || post.image,
      };
      await this.postRepository.updatePost(id, dataUpdate);

      await this.redisService.set(id, JSON.stringify({ ...post, ...dataUpdate }));

      await this.elasticsearchService.updateIndex('posts', id, dataUpdate);

      return {
        statusCode: 200,
        message: 'Post updated',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async deletePost(id: string): Promise<Partial<I_Base_Response>> {
    try {
      const post = await this.findPostById(id);
      if (!post) {
        throw new HttpException('Post not found', 404);
      }
      await this.postRepository.deletePost(id);

      const responseRedis = await this.redisService.get(id);
      if (responseRedis) {
        await this.redisService.del(id);
      }

      const responseElasticsearch = await this.elasticsearchService.getPostById('posts', id);

      if (responseElasticsearch) {
        await this.elasticsearchService.deleteIndex('posts', id);
      }

      return {
        statusCode: 200,
        message: 'Post deleted',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async deletePosts(listIdPost: string[]): Promise<Partial<I_Base_Response>> {
    try {
      await this.postRepository.deletePosts(listIdPost);
      return {
        statusCode: 200,
        message: 'Posts deleted',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
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
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async getPostsByTitleByElasticsearch(title: string): Promise<I_Base_Response<Post[]>> {
    try {
      const query = {
        query: {
          query_string: {
            default_field: 'title',
            query: `*${title || ''}*`,
          },
        },
      };
      const result = await this.elasticsearchService.search('posts', query);

      if (!result) throw new HttpException('Posts not found', 404);
      return {
        statusCode: 200,
        message: 'Posts found',
        data: result.body.hits?.hits?.map((item) => ({
          ...item._source,
          id: item._id,
        })) as Post[],
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }
}
