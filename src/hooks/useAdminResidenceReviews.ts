"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchAdminResidenceReviews } from "@/lib/api/adminResidenceReviews";
import { ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT } from "@/lib/constants/adminResidenceReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import type { AdminResidenceReviewListQuery } from "@/types/adminResidenceReview";

export function useAdminResidenceReviews(query: AdminResidenceReviewListQuery = {}) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_RESIDENCE_REVIEW_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";
  const sort = query.sort ?? "LATEST";
  const isHidden = query.isHidden;

  return useQuery({
    queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.LIST({
      page,
      limit,
      keyword,
      sort,
      isHidden,
    }),
    queryFn: () =>
      fetchAdminResidenceReviews({
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
