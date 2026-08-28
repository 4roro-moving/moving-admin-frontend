"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminReportDetail, fetchAdminReportSummary } from "@/lib/api/adminReports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useAdminReportDetail(reportId: number | null) {
  return useQuery({
    queryKey: reportId ? QUERY_KEYS.REPORTS.DETAIL(reportId) : QUERY_KEYS.REPORTS.DETAIL_PLACEHOLDER,
    queryFn: () => {
      if (reportId === null) {
        throw new Error("신고 ID가 필요합니다.");
      }

      return fetchAdminReportDetail(reportId);
    },
    enabled: reportId !== null,
  });
}

export function useAdminReportSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.REPORTS.SUMMARY,
    queryFn: fetchAdminReportSummary,
    enabled: true,
  });
}
