"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminDashboard } from "@/lib/api/adminDashboard";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.SUMMARY,
    queryFn: fetchAdminDashboard,
    enabled: true,
  });
}
