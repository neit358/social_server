import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';

import { SearchService as ElasticsearchService } from 'src/services/elasticsearch.service';

@Module({
  imports: [
    NestElasticsearchModule.registerAsync({
      useFactory: () => {
        return {
          node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
          maxRetries: 5,
          requestTimeout: 60000,
          pingTimeout: 30000,
          ssl: {
            rejectUnauthorized: false,
          },
          compatibility: true,
        };
      },
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
