export interface I_Base_Single {
  field: string;
  value: string | number;
}

export interface I_Base_Array {
  field: string;
  value: Array<string | number>;
}

export interface I_Range {
  field: string;
  gte?: string;
  lte?: string;
  gt?: string;
  lt?: string;
}

export interface I_Query_String {
  default_field: string;
  query: string;
}

export interface I_QueryElasticsearch {
  query_string?: I_Query_String;
  match?: I_Base_Single;
  match_phrase?: I_Base_Single;
  multi_match?: I_Base_Array & {
    type: string;
  };
  term?: I_Base_Single;
  terms?: I_Base_Array;
  range?: I_Range;
}

export interface I_BaseElasticsearch {
  index: string;
  id: string;
}

export interface I_ElasticsearchData<T> extends I_BaseElasticsearch {
  body: T;
}
