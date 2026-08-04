export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success?: false;
  errorCode?: string;
  message: string;
  data?: unknown;
}
