"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  ADMIN_NOTICE_LIST_PAGE_LIMIT,
  fetchAdminNotices,
} from "@/lib/api/adminNotices";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminNoticeListQuery } from "@/types/adminNotice";

export function useAdminNotices(query: AdminNoticeListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_NOTICE_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.NOTICES.LIST({
      page,
      limit,
      keyword,
      audience: query.audience,
      isVisible: query.isVisible,
    }),

    queryFn: () =>
      fetchAdminNotices({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
      }),

    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
