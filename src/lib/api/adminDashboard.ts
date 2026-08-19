import { MOCK_ADMIN_DASHBOARD } from "@/mocks/adminDashboardMock";
import type { AdminDashboardData } from "@/types/adminDashboard";

export const USE_ADMIN_DASHBOARD_MOCK =
  process.env.NEXT_PUBLIC_USE_ADMIN_DASHBOARD_MOCK === "true";

function assertAdminDashboardApiUnavailable(): never {
  throw new Error("관리자 Dashboard API가 아직 연결되지 않았습니다.");
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  if (USE_ADMIN_DASHBOARD_MOCK) {
    return MOCK_ADMIN_DASHBOARD;
  }

  return assertAdminDashboardApiUnavailable();
}
