"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAdminGiveaways } from "@/lib/api/adminGiveaways";
import { ADMIN_GIVEAWAY_LIST_PAGE_LIMIT } from "@/lib/constants/adminGiveaways";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminGiveawayListQuery } from "@/types/adminGiveaway";

export function useAdminGiveaways(query: AdminGiveawayListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_GIVEAWAY_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";
  const sort = query.sort ?? "LATEST";
  const isHidden = query.isHidden;

  return useQuery({
    queryKey: QUERY_KEYS.GIVEAWAYS.LIST({
      page,
      limit,
      keyword,
      sort,
      isHidden,
    }),
    queryFn: () =>
      fetchAdminGiveaways({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
        sort,
        isHidden,
      }),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
