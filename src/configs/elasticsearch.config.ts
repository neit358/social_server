import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';

import { SearchService as ElasticsearchService } from 'src/services/elasticsearch.services';

@Module({
  imports: [
    NestElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE,
        maxRetries: 5,
        requestTimeout: 60000,
        pingTimeout: 30000,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME || 'defaultUsername',
          password: process.env.ELASTICSEARCH_PASSWORD || 'defaultPassword',
        },
        ssl: {
          rejectUnauthorized: false,
        },
        compatibility: true,
      }),
    }),
  ],
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}
