import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { AdminLoginInput, AdminSession, AdminUser } from "@/types/auth";

import { ApiClientError, fetchInstance } from "./fetchInstance";

interface AdminLoginResponseData {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive?: boolean;
  };
  tokens: {
    accessToken: string;
  };
}

interface AdminRefreshResponseData {
  tokens: {
    accessToken: string;
  };
}

interface AdminMeResponseData {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive?: boolean;
    createdAt?: string;
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAccessTokenFromTokens(tokensValue: unknown): string {
  if (!isPlainObject(tokensValue)) {
    throw new ApiClientError({
      status: 500,
      message: "응답에 tokens 정보가 없습니다.",
    });
  }

  const accessToken = tokensValue.accessToken;

  if (typeof accessToken !== "string" || accessToken.length === 0) {
    throw new ApiClientError({
      status: 500,
      message: "응답에 accessToken이 없습니다.",
    });
  }

  return accessToken;
}

function parseAdminUser(value: unknown): AdminUser {
  if (!isPlainObject(value)) {
    throw new ApiClientError({
      status: 500,
      message: "관리자 정보 형식이 올바르지 않습니다.",
    });
  }

  const { id, name, email, role, isActive } = value;

  if (role !== "ADMIN") {
    throw new ApiClientError({
      status: 403,
      message: "관리자 권한이 없습니다.",
    });
  }

  if (isActive === false) {
    throw new ApiClientError({
      status: 403,
      message: "비활성화된 관리자 계정입니다.",
    });
  }

  if (
    (typeof id !== "string" && typeof id !== "number") ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    throw new ApiClientError({
      status: 500,
      message: "관리자 정보 형식이 올바르지 않습니다.",
    });
  }

  return {
    id: String(id),
    name,
    email,
    role: "ADMIN",
  };
}

function parseAdminLoginResponse(data: unknown): AdminSession {
  if (!isPlainObject(data)) {
    throw new ApiClientError({
      status: 500,
      message: "로그인 응답 형식이 올바르지 않습니다.",
    });
  }

  return {
    user: parseAdminUser(data.admin),
    accessToken: parseAccessTokenFromTokens(data.tokens),
  };
}

export async function loginAdmin(input: AdminLoginInput): Promise<AdminSession> {
  const body = await fetchInstance.post<ApiResponse<AdminLoginResponseData>>(
    API_ROUTES.AUTH.LOGIN,
    input,
  );

  return parseAdminLoginResponse(body.data);
}

export async function refreshAdminSession(): Promise<string> {
  const body = await fetchInstance.post<ApiResponse<AdminRefreshResponseData>>(
    API_ROUTES.AUTH.REFRESH,
  );

  if (!isPlainObject(body.data)) {
    throw new ApiClientError({
      status: 500,
      message: "세션 복구 응답 형식이 올바르지 않습니다.",
    });
  }

  return parseAccessTokenFromTokens(body.data.tokens);
}

export async function getCurrentAdmin(accessToken: string): Promise<AdminUser> {
  const body = await fetchInstance.get<ApiResponse<AdminMeResponseData>>(API_ROUTES.AUTH.ME, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!isPlainObject(body.data)) {
    throw new ApiClientError({
      status: 500,
      message: "관리자 정보 응답 형식이 올바르지 않습니다.",
    });
  }

  return parseAdminUser(body.data.admin);
}

export async function logoutAdmin(): Promise<void> {
  await fetchInstance.post<ApiResponse<null>>(API_ROUTES.AUTH.LOGOUT);
}
