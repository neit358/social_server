import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { Post } from 'src/modules/post/entities/post.entity';
import { I_Base_Response, I_ResponseElasticsearch } from 'src/types/response.type';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(index: string, data: Post): Promise<Partial<I_Base_Response>> {
    const result = await this.elasticsearchService.index({
      index,
      id: data.id,
      body: {
        title: data.title,
        content: data.content,
        image: data.image,
        userId: data.userId,
      },
    });
    return {
      statusCode: result.statusCode || 200,
    };
  }

  async search(
    index: string,
    query: Record<string, any>,
  ): Promise<I_ResponseElasticsearch<Post[]>> {
    const result = await this.elasticsearchService.search({
      index,
      body: query,
    });
    return result;
  }
}
