"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ADMIN_TERMS_LIST_PAGE_LIMIT, fetchAdminTermsList } from "@/lib/api/adminTerms";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminTermsListQuery } from "@/types/adminTerms";

export function useAdminTermsList(query: AdminTermsListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_TERMS_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.TERMS.LIST({
      page,
      limit,
      keyword,
      type: query.type,
      status: query.status,
    }),

    queryFn: () =>
      fetchAdminTermsList({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
      }),

    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
