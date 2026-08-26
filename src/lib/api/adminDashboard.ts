import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { mapAdminDashboardResponse } from "@/lib/utils/adminDashboard";
import { MOCK_ADMIN_DASHBOARD } from "@/mocks/adminDashboardMock";
import type { ApiResponse } from "@/types/api";
import type {
  AdminDashboardData,
  AdminDashboardPeriod,
  AdminDashboardSummaryResponse,
} from "@/types/adminDashboard";
import { DEFAULT_ADMIN_DASHBOARD_PERIOD } from "@/types/adminDashboard";

/**
 * mock 스위치는 남겨둡니다.
 *
 * 백엔드가 뜨지 않은 환경에서 화면만 만질 때 쓰는 용도이며,
 * 기본값은 실제 API 입니다. `.env` 에 아무것도 없으면 실 API 를 호출합니다.
 */
export const USE_ADMIN_DASHBOARD_MOCK =
  process.env.NEXT_PUBLIC_USE_ADMIN_DASHBOARD_MOCK === "true";

export async function fetchAdminDashboard(
  period: AdminDashboardPeriod = DEFAULT_ADMIN_DASHBOARD_PERIOD,
): Promise<AdminDashboardData> {
  if (USE_ADMIN_DASHBOARD_MOCK) {
    return MOCK_ADMIN_DASHBOARD;
  }

  const search = new URLSearchParams({ period });

  const result = await fetchInstance.get<ApiResponse<AdminDashboardSummaryResponse>>(
    `${API_ROUTES.ADMIN.DASHBOARD}?${search.toString()}`,
  );

  return mapAdminDashboardResponse(result.data);
}
