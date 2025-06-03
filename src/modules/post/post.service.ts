import { HttpException, Injectable } from '@nestjs/common';

import { PostRepository } from './post.repository';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';
import { I_Base_Response } from '../../interfaces/response.interfaces';
import { I_UpdatePost } from './interfaces/create.interface';
import { User } from '../user/entities/user.entity';
import { SearchService } from '../../services/elasticsearch.service';
import { BeanstalkdTube } from '../../provider/constant/beanstalkd.enum';
import { BeanstalkdProvider } from '../../provider/beanstalkd/beanstalkd.provider';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
    private readonly elasticsearchService: SearchService<Post>,
    private readonly beanstalkdProvider: BeanstalkdProvider,
  ) {}

  index = 'social.posts.dev';

  async findPostById(id: string): Promise<I_Base_Response<Post>> {
    try {
      const post = await this.postRepository.findOneById({
        id,
      });
      if (!post) throw new HttpException('Post not found', 404);

      await this.beanstalkdProvider.produce(BeanstalkdTube.base, post);

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
      const posts = await this.postRepository.findAll({
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
      const posts = await this.postRepository.findAll({
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

      const post = this.postRepository.createOne({ ...data, image: urlImage || '' });

      if (!post) throw new HttpException('Post not created', 400);

      const postCreated = await this.postRepository.saveOne(post, this.index);

      return {
        statusCode: 201,
        message: 'Post created',
        data: postCreated,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async updatePost(id: string, body: I_UpdatePost): Promise<Partial<I_Base_Response>> {
    try {
      const post = await this.postRepository.findByCondition({
        where: {
          id,
        },
        relations: {
          user: true,
        },
      });
      if (!post) throw new HttpException('Post not found', 404);

      let urlImage: string | null = null;

      if (body.image) {
        urlImage =
          (process.env.HOST ?? 'http://localhost') +
          ':' +
          (process.env.PORT ?? '3001') +
          '/' +
          body.image;
      }

      const { title, content, userId, ...docs } = post;

      const dataUpdate = {
        title,
        content,
        userId,
        ...body,
        image: urlImage || docs.image,
      };

      await this.postRepository.update(id, dataUpdate, this.index);

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
      const post = await this.postRepository.findOneById({ id });
      if (!post) {
        throw new HttpException('Post not found', 404);
      }
      await this.postRepository.remove(post, this.index);

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

      await this.elasticsearchService.deleteIndex({
        index: this.index,
        id: listIdPost.join(','),
      });

      return {
        statusCode: 200,
        message: 'Posts deleted',
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async getUserLikedPostByPostId(postId: string): Promise<I_Base_Response<User>> {
    try {
      const post = await this.postRepository.findByCondition({
        where: { id: postId },
        relations: { likes: { user: true } },
      });
      if (!post) throw new HttpException('Post not found', 404);
      return {
        statusCode: 200,
        message: 'Post found',
        data: post.user,
      };
    } catch (error) {
      throw new HttpException((error as Error).message, 404);
    }
  }

  async getPostsConditionByElasticsearch(
    default_field: string,
    value: string,
  ): Promise<I_Base_Response<Post[]>> {
    try {
      const query = this.elasticsearchService.generateQuery({
        query_string: {
          default_field,
          query: value,
        },
      });

      const result = await this.elasticsearchService.search(this.index, {
        query,
      });

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

// agg elasticsearch
