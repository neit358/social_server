import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { SearchService } from 'src/services/elasticsearch.services';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponsePostElasticsearchDto } from './dto/reponse-post.dto';

export class PostRepository {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly elasticsearchService: SearchService,
  ) {}

  async findPostById(id: string): Promise<Post | null> {
    return await this.postRepository.findOneBy({ id });
  }

  async findPosts(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async findPostsByUserId(userId: string): Promise<Post[]> {
    return await this.postRepository.find({ where: { userId } });
  }

  async findPostsBySearch(search: string): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .where('post.title LIKE :search', { search: `%${search}%` })
      .getMany();
  }

  async createPost(data: CreatePostDto): Promise<Post | null> {
    const post = this.postRepository.create(data);
    return await this.postRepository.save(post);
  }

  async deletePost(id: string): Promise<boolean | null> {
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

  async getUserLikedPostsByPostId(postId: string): Promise<Post | null> {
    return await this.postRepository.findOne({
      where: { id: postId },
      relations: { likes: { user: true } },
    });
  }

  async addPostToElasticsearch(index: string, data: Post): Promise<any> {
    return await this.elasticsearchService.createIndex(index, data);
  }

  async createIndex(index: string, postCreated: Post): Promise<any> {
    return await this.elasticsearchService.createIndex(index, postCreated);
  }

  async searchPostsByTitleByElasticsearch(
    index: string,
    query: Record<string, any>,
  ): Promise<ResponsePostElasticsearchDto> {
    return await this.elasticsearchService.search(index, query);
  }
}
