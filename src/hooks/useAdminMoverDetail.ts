"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminMoverDetail } from "@/lib/api/adminMovers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useAdminMoverDetail(moverId: string | null) {
  return useQuery({
    queryKey: moverId
      ? QUERY_KEYS.MOVERS.DETAIL(moverId)
      : QUERY_KEYS.MOVERS.DETAIL_PLACEHOLDER,
    queryFn: () => {
      if (!moverId) {
        throw new Error("기사 ID가 필요합니다.");
      }

      return fetchAdminMoverDetail(moverId);
    },
    enabled: Boolean(moverId),
  });
}
