export interface I_Base_Response<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export interface I_ResponseElasticsearch<T> {
  body: {
    hits?: {
      total: {
        value: number;
        relation: string;
      };
      hits: {
        _id: string;
        _source: T;
      }[];
    };
  };
}
