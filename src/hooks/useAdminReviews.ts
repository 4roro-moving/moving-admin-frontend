"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ADMIN_REVIEW_LIST_PAGE_LIMIT, fetchAdminReviews } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminReviewListQuery } from "@/types/adminReview";

export function useAdminReviews(query: AdminReviewListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REVIEW_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";
  const sort = query.sort ?? "LATEST";

  return useQuery({
    queryKey: QUERY_KEYS.REVIEWS.LIST({
      page,
      limit,
      keyword,
      sort,
    }),
    queryFn: () =>
      fetchAdminReviews({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
        sort,
      }),
    placeholderData: keepPreviousData,
    enabled: isAuthenticated,
  });
}
