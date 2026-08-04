import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type { AdminLoginInput, AdminSession } from "@/types/auth";

import { fetchInstance } from "./fetchInstance";

export function loginAdmin(input: AdminLoginInput) {
  return fetchInstance.post<ApiResponse<AdminSession>>(API_ROUTES.AUTH.LOGIN, input);
}

export function refreshAdminSession() {
  return fetchInstance.post<ApiResponse<AdminSession>>(API_ROUTES.AUTH.REFRESH);
}

export function logoutAdmin() {
  return fetchInstance.post<ApiResponse<null>>(API_ROUTES.AUTH.LOGOUT);
}
