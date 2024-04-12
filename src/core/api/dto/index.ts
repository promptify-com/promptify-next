export interface IPagination<T extends unknown> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IPaginateParams {
  limit?: number;
  offset?: number;
}
