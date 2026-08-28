import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { ApiErrorResponse } from "@/types/api";
import type { PaginatedApiSuccessResponse, Pagination } from "@/types/pagination";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | object | null;
  /** true면 401이어도 refresh/retry 하지 않음 (login/refresh/logout) */
  skipRefresh?: boolean;
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

const NO_REFRESH_PATHS: readonly string[] = [
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.REFRESH,
  API_ROUTES.AUTH.LOGOUT,
];

let refreshPromise: Promise<string> | null = null;

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

function clearSessionAndRedirectToLogin(): void {
  useAdminAuthStore.getState().clearSession();

  if (typeof window !== "undefined" && window.location.pathname !== APP_ROUTES.LOGIN) {
    window.location.assign(APP_ROUTES.LOGIN);
  }
}

/**
 * refresh는 cookie 기반이므로 Authorization 없이 호출한다.
 * fetchInstance.request 와 순환/재귀를 피하기 위해 raw fetch 를 사용한다.
 * 동시 401은 하나의 refreshPromise 를 공유한다.
 */
async function refreshAccessTokenOnce(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(buildUrl(API_ROUTES.AUTH.REFRESH), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const parsed = await parseResponse(response);

      if (!response.ok) {
        throw new ApiClientError({
          status: response.status,
          message: isApiErrorResponse(parsed)
            ? parsed.message
            : "세션 갱신에 실패했습니다.",
          errorCode: isApiErrorResponse(parsed) ? parsed.errorCode : undefined,
          data: isApiErrorResponse(parsed) ? parsed.data : undefined,
        });
      }

      if (!isPlainObject(parsed) || !isPlainObject(parsed.data)) {
        throw new ApiClientError({
          status: 500,
          message: "세션 복구 응답 형식이 올바르지 않습니다.",
        });
      }

      const tokens = parsed.data.tokens;

      if (!isPlainObject(tokens) || typeof tokens.accessToken !== "string" || !tokens.accessToken) {
        throw new ApiClientError({
          status: 500,
          message: "응답에 accessToken이 없습니다.",
        });
      }

      useAdminAuthStore.getState().setAccessToken(tokens.accessToken);
      return tokens.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  retried = false,
): Promise<T> {
  const { body, headers, skipRefresh, ...restOptions } = options;
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
    const shouldRefresh =
      !retried &&
      !skipRefresh &&
      response.status === 401 &&
      !NO_REFRESH_PATHS.includes(path);

    if (shouldRefresh) {
      try {
        await refreshAccessTokenOnce();
        // 호출부가 만료된 Authorization 을 넘긴 경우 새 토큰이 붙도록 제거한다.
        const retryHeaders = toHeaderRecord(headers);
        for (const key of Object.keys(retryHeaders)) {
          if (key.toLowerCase() === "authorization") {
            delete retryHeaders[key];
          }
        }
        return request<T>(path, { ...options, headers: retryHeaders }, true);
      } catch (refreshError) {
        clearSessionAndRedirectToLogin();
        throw refreshError;
      }
    }

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
