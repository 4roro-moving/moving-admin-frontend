export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

/** Backend ErrorResponse: `{ success: false, error: { code, message, data? }, ... }` */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    data?: unknown;
  };
  path?: string;
  method?: string;
  timestamp?: string;
}
