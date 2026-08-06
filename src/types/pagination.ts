export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

export interface PaginatedApiSuccessResponse<T> {
  success?: true;
  data: T;
  pagination: Pagination;
}
