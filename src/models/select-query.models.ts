export interface SelectQueryOptions {
  limit?: number;
  offset?: number;
  order?: SelectQueryOrder[];
}

export interface SelectQueryOrder {
  property: string;
  direction?: 'ASC' | 'DESC';
}
