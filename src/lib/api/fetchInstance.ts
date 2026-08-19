import type { ApiErrorResponse } from "@/types/api";
import type { PaginatedApiSuccessResponse, Pagination } from "@/types/pagination";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
}

export class ApiClientError extends Error {
  status: number;
  errorCode?: string;
  data?: unknown;

  constructor(params: { status: number; message: string; errorCode?: string; data?: unknown }) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.errorCode = params.errorCode;
    this.data = params.data;
  }
}

function buildUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${baseUrl}${path}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return isPlainObject(value) && typeof value.message === "string";
}

function toHeaderRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return { ...headers };
}

function hasAuthorizationHeader(headers: Record<string, string>): boolean {
  return Object.keys(headers).some((key) => key.toLowerCase() === "authorization");
}

function buildRequestHeaders(
  headers: HeadersInit | undefined,
  isFormData: boolean,
): Record<string, string> {
  const callerHeaders = toHeaderRecord(headers);
  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...callerHeaders,
  };

  if (!hasAuthorizationHeader(requestHeaders)) {
    const accessToken = useAdminAuthStore.getState().accessToken;

    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  return requestHeaders;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...restOptions } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(buildUrl(path), {
    credentials: "include",
    ...restOptions,
    headers: buildRequestHeaders(headers, isFormData),
    body:
      body === undefined || body === null || typeof body === "string" || isFormData
        ? body
        : JSON.stringify(body),
  });

  const parsed = await parseResponse(response);

  if (!response.ok) {
    const errorBody = isApiErrorResponse(parsed) ? parsed : undefined;

    throw new ApiClientError({
      status: response.status,
      message:
        errorBody?.message ??
        (typeof parsed === "string" && parsed.length > 0
          ? parsed
          : "요청 처리 중 오류가 발생했습니다."),
      errorCode: errorBody?.errorCode,
      data: errorBody?.data,
    });
  }

  return parsed as T;
}

export const fetchInstance = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  getPaginated: async <TResponse, TPagination = Pagination>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<{ data: TResponse; pagination: TPagination }> => {
    const body = await request<PaginatedApiSuccessResponse<TResponse>>(path, {
      ...options,
      method: "GET",
    });

    if (!body || body.pagination === undefined) {
      throw new ApiClientError({
        status: 500,
        message: "페이지네이션 응답이 올바르지 않습니다.",
      });
    }

    return { data: body.data, pagination: body.pagination as TPagination };
  },

  post: <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: RequestOptions["body"], options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
