import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CreatedAdminAccount, CreateAdminAccountPayload } from "@/types/adminAccount";
import type { ApiResponse } from "@/types/api";

export async function createAdminAccount(
  payload: CreateAdminAccountPayload,
): Promise<CreatedAdminAccount> {
  const result = await fetchInstance.post<ApiResponse<CreatedAdminAccount>>(
    API_ROUTES.ADMIN.ADMINS.ROOT,
    payload,
  );

  return result.data;
}
