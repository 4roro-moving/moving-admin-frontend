"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ADMIN_FAQ_LIST_PAGE_LIMIT, fetchAdminFaqs } from "@/lib/api/adminFaqs";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminFaqListQuery } from "@/types/adminFaq";

export function useAdminFaqs(query: AdminFaqListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_FAQ_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.FAQS.LIST({
      page,
      limit,
      keyword,
      isVisible: query.isVisible,
    }),

    queryFn: () =>
      fetchAdminFaqs({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
      }),

    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
