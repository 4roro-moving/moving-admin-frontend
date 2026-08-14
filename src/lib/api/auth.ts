import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminLoginInput,
  AdminLoginResponse,
  AdminMeResponse,
  AdminRefreshResponse,
  AdminSession,
} from "@/types/auth";

import { fetchInstance } from "./fetchInstance";

export async function loginAdmin(input: AdminLoginInput): Promise<AdminSession> {
  const response = await fetchInstance.post<ApiResponse<AdminLoginResponse>>(API_ROUTES.AUTH.LOGIN, input);
  return { user: response.data.admin, accessToken: response.data.tokens.accessToken };
}

export async function refreshAdminSession(): Promise<string> {
  const response = await fetchInstance.post<ApiResponse<AdminRefreshResponse>>(API_ROUTES.AUTH.REFRESH);
  return response.data.tokens.accessToken;
}

export function logoutAdmin() {
  return fetchInstance.post<ApiResponse<null>>(API_ROUTES.AUTH.LOGOUT);
}

export async function fetchCurrentAdmin(): Promise<AdminMeResponse["admin"]> {
  const response = await fetchInstance.get<ApiResponse<AdminMeResponse>>(API_ROUTES.AUTH.ME);
  return response.data.admin;
}
