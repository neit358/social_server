import { CreatePostDto } from './create-post.dto';

export interface ResponsePostElasticsearchDto {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{
      _id: string;
      _source: CreatePostDto;
    }>;
  };
}
