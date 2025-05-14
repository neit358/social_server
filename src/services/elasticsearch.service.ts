import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { I_ResponseElasticsearch } from 'src/interfaces/response.interfaces';
import {
  I_Base_Array,
  I_Base_Single,
  I_BaseElasticsearch,
  I_ElasticsearchData,
  I_Query_String,
  I_QueryElasticsearch,
} from './interfaces/elasticsearch.interface';

interface hasId {
  id: string;
}

@Injectable()
export class SearchService<T extends hasId> {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex({ index, id, body }: I_ElasticsearchData<T>): Promise<void> {
    await this.elasticsearchService.index({
      index,
      id,
      body,
    });
  }

  async updateIndex({ index, id, body }: I_ElasticsearchData<Partial<T>>): Promise<void> {
    await this.elasticsearchService.update({
      index,
      id,
      body: {
        doc: body,
      },
    });
  }

  async deleteIndex({ index, id }: I_BaseElasticsearch): Promise<void> {
    await this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async search(index: string, query: Record<string, any>): Promise<I_ResponseElasticsearch<T>> {
    const result = await this.elasticsearchService.search({
      index,
      body: query,
    });
    return result;
  }

  generateQuery(data: I_QueryElasticsearch): Record<string, any> {
    const query: {
      bool: {
        must: Array<
          | { query_string?: I_Query_String }
          | { match?: I_Base_Single }
          | { match_phrase?: I_Base_Single }
          | {
              multi_match?: I_Base_Array & {
                type: string;
              };
            }
          | { term?: I_Base_Single }
          | { terms?: I_Base_Array }
          | { range?: Record<string, any> }
        >;
      };
    } = {
      bool: {
        must: [],
      },
    };

    if (data.query_string) {
      query.bool.must.push({
        query_string: data.query_string,
      });
    }

    if (data.match) {
      query.bool.must.push({
        match: data.match,
      });
    }

    if (data.match_phrase) {
      query.bool.must.push({
        match_phrase: data.match_phrase,
      });
    }

    if (data.multi_match) {
      query.bool.must.push({
        multi_match: data.multi_match,
      });
    }

    if (data.term) {
      query.bool.must.push({
        term: data.term,
      });
    }

    if (data.terms) {
      query.bool.must.push({
        terms: data.terms,
      });
    }

    if (data.range) {
      const { field, ...rest } = data.range;
      query.bool.must.push({
        range: {
          [field]: rest,
        },
      });
    }

    return query;
  }
}
