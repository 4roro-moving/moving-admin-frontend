"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  ADMIN_INQUIRY_LIST_PAGE_LIMIT,
  fetchAdminInquiries,
} from "@/lib/api/adminInquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminInquiryListQuery } from "@/types/adminInquiry";

export function useAdminInquiries(query: AdminInquiryListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_INQUIRY_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";

  return useQuery({
    queryKey: QUERY_KEYS.INQUIRIES.LIST({
      page,
      limit,
      keyword,
      status: query.status,
      openOnly: query.openOnly,
    }),

    queryFn: () =>
      fetchAdminInquiries({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
      }),

    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
