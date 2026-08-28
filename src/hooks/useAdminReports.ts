"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAdminReports } from "@/lib/api/adminReports";
import { ADMIN_REPORT_LIST_PAGE_LIMIT } from "@/lib/constants/adminReports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReportListQuery } from "@/types/adminReport";

export function useAdminReports(query: AdminReportListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REPORT_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";
  const status = query.status ?? "ALL";
  const targetType = query.targetType ?? "ALL";
  const reason = query.reason ?? "ALL";
  const sort = query.sort ?? "LATEST";

  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.LIST({
      page,
      limit,
      keyword,
      status,
      targetType,
      reason,
      sort,
    }),
    queryFn: () =>
      fetchAdminReports({
        page,
        limit,
        keyword: keyword || undefined,
        status,
        targetType,
        reason,
        sort,
      }),
    placeholderData: keepPreviousData,
    enabled: true,
  });
}
