"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAdminDashboard } from "@/lib/api/adminDashboard";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminDashboardPeriod } from "@/types/adminDashboard";
import { DEFAULT_ADMIN_DASHBOARD_PERIOD } from "@/types/adminDashboard";

export function useAdminDashboard(
  period: AdminDashboardPeriod = DEFAULT_ADMIN_DASHBOARD_PERIOD,
) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY(period),
    queryFn: () => fetchAdminDashboard(period),

    /*
     * 서버가 60초 TTL 캐시를 두고 있어 그 주기 안에서는 같은 값이 옵니다.
     * 클라이언트도 같은 주기로 맞춰 불필요한 왕복을 줄입니다.
     */
    staleTime: 60_000,

    // 기간을 바꿀 때 화면이 로딩 상태로 깜빡이지 않게 이전 데이터를 유지합니다.
    placeholderData: keepPreviousData,

    enabled: isAuthenticated,
  });
}
