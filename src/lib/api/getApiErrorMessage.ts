import { ApiClientError } from "@/lib/api/fetchInstance";

export function getApiErrorMessage(error: unknown, fallback = "요청에 실패했습니다."): string {
  if (error instanceof ApiClientError && error.message.trim()) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
