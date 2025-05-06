import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from 'src/modules/post/entities/post.entity';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex(index: string, data: Post) {
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
    return result;
  }

  async search(index: string, query: Record<string, any>) {
    const result = await this.elasticsearchService.search({
      index,
      body: query,
    });
    return result;
  }
}
