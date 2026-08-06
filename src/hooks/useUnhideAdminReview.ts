"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unhideAdminReview } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewActionReasonPayload } from "@/types/adminReview";

interface UnhideAdminReviewVariables {
  reviewId: number;
  reason?: string;
}

export function useUnhideAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reason }: UnhideAdminReviewVariables) =>
      unhideAdminReview(
        reviewId,
        reason?.trim() ? ({ reason } satisfies AdminReviewActionReasonPayload) : undefined,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
    },
  });
}
