import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { I_Base_Response, I_ResponseElasticsearch } from 'src/interfaces/response.interfaces';

import { Post } from 'src/modules/post/entities/post.entity';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(index: string, data: Post): Promise<void> {
    await this.elasticsearchService.index({
      index,
      id: data.id,
      body: {
        title: data.title,
        content: data.content,
        image: data.image,
        userId: data.userId,
      },
    });
  }

  async updateIndex(index: string, id: string, data: Partial<Post>): Promise<void> {
    await this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: data,
      },
    });
  }

  async deleteIndex(index: string, id: string): Promise<void> {
    await this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async search(index: string, query: Record<string, any>): Promise<I_ResponseElasticsearch<Post>> {
    const result = await this.elasticsearchService.search({
      index,
      body: query,
    });
    return result;
  }

  async getPostById(index: string, id: string): Promise<Partial<I_Base_Response<Post>> | null> {
    try {
      const result = await this.elasticsearchService.get({
        index,
        id,
      });
      return {
        statusCode: result.statusCode || 200,
        message: result.body.found ? 'Post found' : 'Post not found',
        data: result.body._source as Post,
      };
    } catch {
      return null;
    }
  }
}
